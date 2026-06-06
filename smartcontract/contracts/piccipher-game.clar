;; piccipher-game
;; A picture-word guessing game for Stacks

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-played (err u102))
(define-constant err-inactive-round (err u103))

;; Data Maps
