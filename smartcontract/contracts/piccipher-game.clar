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
        
        (var-set current-round-id new-id)
        (ok new-id)
    )
)

;; Read-only Functions
(define-read-only (get-player-stats (player principal))
    (default-to 
        { total-score: u0, current-streak: u0, best-streak: u0, games-played: u0 }
        (map-get? PlayerStats player)
    )
)
