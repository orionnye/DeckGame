import Canvas from "./common/Canvas";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Input from "./common/Input";
import { getImage } from "./common/common";
import Card from "./Card";
import Melter from "./Melter";
import Sprite from "./Sprite";
import CardTypes from "./CardTypes";

export default class Game {
    enemyCount = 0
    deck = new Deck( 20, 30, 250, -1, 1 )
    hand = new Deck( 5, 145, 250, 90, 0 )
    discard = new Deck( 0, 600, 250, 1, 1 )

    player = new Pawn( 100, 50, 175, 175, "red" )
    enemy = new Pawn( 500, 50, 150, 150, "blue", 2 )
    enemySprites = [ "PawnChadwick2", "Archlizard", "BoneDragon" ]

    win = false

    melter = new Melter( 325, 375 )

    handCap = 5
    grabbing = false

    constructor() {
        window.addEventListener( "keyup", e => this.keyup( e ) )

        this.player.sprite = new Sprite( getImage( "PawnEgor" ) )
            .setSource( { x: 0, y: 0, w: 69, h: 69 } )
            .setDimensions( this.player.width, this.player.height )
        this.player.main = true

        this.enemy.sprite = new Sprite( getImage( this.enemySprites[ 0 ] ) )
            .setSource( { x: 0, y: 0, w: 60, h: 64 } )
            .setDimensions( this.enemy.width * 0.8, this.enemy.height * 0.8 )
    }

    get pawns() {
        return [ this.player, this.enemy ]
    }

    keyup( e: KeyboardEvent ) {
        let { deck, hand } = this
        if ( e.key == "Enter" )
            if ( hand.length == 0 && deck.length > 0 )
                this.endTurn()
    }

    endTurn() {
        let { enemy, enemySprites, enemyCount, win, player, melter, deck } = this
        player.health += player.heal
        //if enemy health is alive
        if ( enemy.health > 0 ) {
            player.health -= enemy.damage
            enemy.health += enemy.heal
            enemy.offset.x = -60
            player.offset.x = -20
        } else if (enemyCount !== enemySprites.length - 1) {
            //if enemy is dead and !the last enemy
            this.enemyCount += 1
            this.newEncounter()
        }
        if (enemy.health <= 0 && enemyCount == enemySprites.length - 1)
            this.win = true


        this.refillHand()

        let product = melter.product
        console.log( "Crafted " + product.type.name )
        deck.cards.push( product )
        melter.base = new Card( melter.position, CardTypes.Volatile )
        melter.ingredients = []
    }
    newEncounter() {
        let { enemyCount, enemy, enemySprites } = this
        enemy.heal = enemyCount + 1
        enemy.damage = enemyCount + 1
        enemy.health =  (enemyCount + 2) * 3
        enemy.sprite = new Sprite( getImage( enemySprites[ enemyCount ] ) )
            .setSource( { x: 0, y: 0, w: 60, h: 64 } )
            .setDimensions( enemy.width * 0.8, enemy.height * 0.8 )
    }

    refillHand() {
        let { deck, hand, discard, handCap } = this

        if ( deck.length < handCap ) {
            for ( let card of deck.cards )
                hand.cards.push( card )
            deck.cards = discard.cards
            discard.cards = []
        }

        while ( hand.length < handCap )
            deck.transferCard( hand )
    }

    update() {
        this.render()

        let { deck, hand, discard, enemy, player } = this
        let { buttons } = Input

        if ( player.offset.length > 1 )
            player.updateToFixed()

        enemy.updateToFixed()

        hand.updateToFixed()
        discard.updateToFixed()
        deck.updateToFixed()

        for ( let card of hand.cards )
            card.update( this )

        if ( !buttons.Mouse0 && hand.length > 0 )
            for ( let card of hand.cards )
                card.grabbed = false
    }

    render() {
        let { deck, enemyCount, hand, discard } = this

        Canvas.resize( 700, 500 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( "rgb(0, 0, 255)" )

        let backgroundY = 150
        Canvas.rect( 0, backgroundY, Canvas.canvas.clientWidth, Canvas.canvas.clientHeight )
            .fillStyle( "rgb(100, 100, 100" )
            .fill()
        Canvas.image( getImage( "Ground" ), 0, backgroundY - 5, Canvas.canvas.clientWidth, 200 )
        Canvas.image( getImage( "BackGroundMid" ), 0, 0, Canvas.canvas.clientWidth, backgroundY )

        //Level Count
        Canvas.fillStyle( "rgb(255, 0, 0)" )
            .text( "level" + enemyCount, Canvas.canvas.clientWidth / 2 - 45, 30, 100, "40px pixel" );

        this.melter.draw()

        for ( let pawn of this.pawns )
            pawn.draw()

        deck.draw()
        discard.draw()
        hand.draw( false )

        if ( this.player.health <= 0 ) {
            Canvas.fillStyle( "rgb(100, 0, 0)" )
            let deathMessageWidth = 700
            let deathMessageX = Canvas.canvas.clientWidth / 2 - deathMessageWidth / 2
            let deathMessageY = Canvas.canvas.clientHeight / 2 - 30
            Canvas.text( "You  Died  On  Level " + this.enemyCount, deathMessageX, deathMessageY, deathMessageWidth, "250px pixel" );
        }
        if ( this.win ) {
            Canvas.fillStyle( "rgb(0, 0, 100)" )
            let winMessageWidth = 700
            let winMessageX = Canvas.canvas.clientWidth / 2 - winMessageWidth / 2
            let winMessageY = Canvas.canvas.clientHeight / 2
            Canvas.text( "You Win", winMessageX, winMessageY, winMessageWidth, "400px pixel" );
        }
    }
}