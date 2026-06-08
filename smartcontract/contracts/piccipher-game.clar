;; piccipher-game
;; A picture-word guessing game for Stacks - RPG Campaign Edition

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-registered (err u102))
(define-constant err-not-registered (err u103))
(define-constant err-stage-not-available (err u104))
(define-constant err-incorrect-answer (err u105))
(define-constant err-payment-failed (err u106))

(define-constant bypass-fee u50000) ;; 0.05 STX
(define-constant hint-fee u10000)   ;; 0.01 STX

;; Data Maps
(define-map PlayerProfiles principal 
    { 
        nickname: (string-ascii 50), 
        current-stage: uint
    }
)

(define-map StageAnswerHashes uint (buff 32))

;; Data Variables
(define-data-var next-token-id uint u1)

;; NFT Definition (Beginner Badge & Milestones)
(define-non-fungible-token hacker-badge uint)

;; Public Functions

;; Admin: Set stage answers
(define-public (set-stage-answer-hash (stage-id uint) (answer-hash (buff 32)))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (map-set StageAnswerHashes stage-id answer-hash)
        (ok true)
    )
)

;; Player Registration
(define-public (register (nickname (string-ascii 50)))
    (let
        (
            (token-id (var-get next-token-id))
        )
        (asserts! (is-none (map-get? PlayerProfiles tx-sender)) err-already-registered)
        (asserts! (> (len nickname) u0) (err u107))
        
        ;; Save Profile
        (map-set PlayerProfiles tx-sender {
            nickname: nickname,
            current-stage: u1
        })

        ;; Mint Beginner Badge
        (try! (nft-mint? hacker-badge token-id tx-sender))
        (var-set next-token-id (+ token-id u1))

        (print { event: "player-registered", player: tx-sender, nickname: nickname, token-id: token-id })
        (ok token-id)
    )
)

;; Submit Answer for current stage
(define-public (submit-stage-answer (answer (buff 50)))
    (let
        (
            (profile (unwrap! (map-get? PlayerProfiles tx-sender) err-not-registered))
            (current-stage (get current-stage profile))
            (correct-hash (unwrap! (map-get? StageAnswerHashes current-stage) err-stage-not-available))
            (answer-hash (sha256 answer))
        )
        (asserts! (is-eq answer-hash correct-hash) err-incorrect-answer)
        
        (try! (advance-stage tx-sender profile current-stage))
        (ok true)
    )
)

;; Pay to Bypass Stage
(define-public (bypass-stage)
    (let
        (
            (profile (unwrap! (map-get? PlayerProfiles tx-sender) err-not-registered))
            (current-stage (get current-stage profile))
        )
        (asserts! (is-some (map-get? StageAnswerHashes current-stage)) err-stage-not-available)

        ;; Pay STX fee to admin
        (try! (stx-transfer? bypass-fee tx-sender contract-owner))

        (print { event: "stage-bypassed", player: tx-sender, stage-id: current-stage })
        (try! (advance-stage tx-sender profile current-stage))
        (ok true)
    )
)

;; Pay for a hint
(define-public (buy-hint)
    (let
        (
            (profile (unwrap! (map-get? PlayerProfiles tx-sender) err-not-registered))
            (current-stage (get current-stage profile))
        )
        (asserts! (is-some (map-get? StageAnswerHashes current-stage)) err-stage-not-available)

        ;; Pay STX fee to admin
        (try! (stx-transfer? hint-fee tx-sender contract-owner))

        (print { event: "hint-purchased", player: tx-sender, stage-id: current-stage })
        (ok true)
    )
)

;; Internal helper to advance stage and mint milestone badges
(define-private (advance-stage (player principal) (profile { nickname: (string-ascii 50), current-stage: uint }) (completed-stage uint))
    (let
        (
            (next-stage (+ completed-stage u1))
            (token-id (var-get next-token-id))
        )
        (map-set PlayerProfiles player (merge profile { current-stage: next-stage }))
        (print { event: "stage-completed", player: player, stage-id: completed-stage })

        ;; Mint milestone badges
        (if (or (is-eq completed-stage u10) (or (is-eq completed-stage u25) (is-eq completed-stage u50)))
            (begin
                (try! (nft-mint? hacker-badge token-id player))
                (var-set next-token-id (+ token-id u1))
                (print { event: "badge-minted", player: player, stage-id: completed-stage, token-id: token-id })
                (ok true)
            )
            (ok true)
        )
    )
)

;; Read-only Functions
(define-read-only (get-player-profile (player principal))
    (map-get? PlayerProfiles player)
)
