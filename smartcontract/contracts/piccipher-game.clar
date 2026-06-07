;; piccipher-game
;; A picture-word guessing game for Stacks

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-played (err u102))
(define-constant err-inactive-round (err u103))

;; Data Maps
(define-map PlayerStats principal 
    { 
        total-score: uint, 
        current-streak: uint, 
        best-streak: uint, 
        games-played: uint 
    }
)

(define-map GameRounds uint 
    { 
        mode: uint, 
        answer-hash: (buff 32), 
        is-active: bool 
    }
)

(define-map HasPlayed { player: principal, round-id: uint } bool)

;; Data Variables
(define-data-var current-round-id uint u0)

;; Public Functions
(define-public (create-round (mode uint) (answer-hash (buff 32)))
    (let
        (
            (new-id (+ (var-get current-round-id) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (and (>= mode u1) (<= mode u4)) (err u104))
        
        (map-set GameRounds new-id {
            mode: mode,
            answer-hash: answer-hash,
            is-active: true
        })
        
        (print { event: "round-created", round-id: new-id, mode: mode })
        (var-set current-round-id new-id)
        (ok new-id)
    )
)

(define-public (deactivate-round (round-id uint))
    (let
        (
            (round-data (unwrap! (map-get? GameRounds round-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (get is-active round-data) err-inactive-round)
        
        (map-set GameRounds round-id (merge round-data { is-active: false }))
        (print { event: "round-deactivated", round-id: round-id })
        (ok true)
    )
)

(define-public (submit-answer (round-id uint) (answer (string-ascii 50)))
    (let
        (
            (round-data (unwrap! (map-get? GameRounds round-id) err-not-found))
            (player tx-sender)
            (stats (get-player-stats player))
            (is-correct (is-eq (sha256 answer) (get answer-hash round-data)))
            (points-earned (if is-correct (* (get mode round-data) u10) u0))
        )
        (asserts! (get is-active round-data) err-inactive-round)
        (asserts! (is-none (map-get? HasPlayed { player: player, round-id: round-id })) err-already-played)
        
        (map-set HasPlayed { player: player, round-id: round-id } true)
        
        ;; Update player stats
        (if is-correct
            (map-set PlayerStats player {
                total-score: (+ (get total-score stats) points-earned),
                current-streak: (+ (get current-streak stats) u1),
                best-streak: (if (> (+ (get current-streak stats) u1) (get best-streak stats)) (+ (get current-streak stats) u1) (get best-streak stats)),
                games-played: (+ (get games-played stats) u1)
            })
            (map-set PlayerStats player {
                total-score: (get total-score stats),
                current-streak: u0,
                best-streak: (get best-streak stats),
                games-played: (+ (get games-played stats) u1)
            })
        )
        (print { event: "answer-submitted", player: player, round-id: round-id, is-correct: is-correct, points-earned: points-earned })
        (ok is-correct)
    )
)

;; Read-only Functions
(define-read-only (get-player-stats (player principal))
    (default-to 
        { total-score: u0, current-streak: u0, best-streak: u0, games-played: u0 }
        (map-get? PlayerStats player)
    )
)
