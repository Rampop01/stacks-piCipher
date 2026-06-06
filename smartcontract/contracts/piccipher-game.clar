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
