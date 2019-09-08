import Canvas from "geode/lib/graphics/Canvas";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Input from "geode/lib/Input";
import Card from "./Card";
import Melter from "./Melter";
import Sprite from "geode/lib/graphics/Sprite";
import CardTypes from "./CardTypes";
import { playAudio, audioInstance } from "geode/lib/audio";
import { getImage, getAudio } from "geode/lib/assets";
import animateSprite from "./animateSprite";
import Transform from "geode/lib/math/Transform";
import Vector, { vector } from "geode/lib/math/Vector";
import GMath from "geode/lib/math/GMath";

export default class Game {
    enemyCount = 0
    deck = new Deck( 10, 30, 250, -1, 1 )
    hand = new Deck( 5, 145, 250, 90, 0 )
    discard = new Deck( 0, 600, 250, 1, 1 )

    playerSprite = new Sprite( getImage( "PawnEgor" ) )
        .setSource( { x: 0, y: 0, w: 180, h: 132 } )
        .setDimensions( 208, 158 )
    player = new Pawn( 100, 80, 100, 100, "red", 60, this.playerSprite )

    enemySprites = [
        new Sprite( getImage( "PawnChadwick2" ) )
            .setSource( { x: 0, y: 0, w: 1000, h: 1000 } )
            .setDimensions( 120, 120 ),
        new Sprite( getImage( "Archlizard" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 50 } )
            .setDimensions( 150, 70 ),
        new Sprite( getImage( "BoneDragon" ) )
            .setSource( { x: 0, y: 0, w: 80, h: 100 } )
            .setDimensions( 130, 130 )
    ]
    enemy = new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 0 ] )

    win = false

    melter = new Melter( 325, 375 )

    handCap = 5
    grabbing = false

    ambience = audioInstance(
        getAudio( "DungeonAmbience" ),
        //TEMPEROARY FIX
        { volume: 0.0 }
        // { volume: 0.30 }
    )
    tunes = audioInstance(
        getAudio( "DungeonTunes" ),
        //TEMPEROARY FIX
        { volume: 0.0 }
        // { volume: 0.35 }
    )

    backgroundRed = 0
    backgroundGreen = 0
    backgroundBlue = 255

    globalTransform = new Transform()

    constructor() {
        window.addEventListener( "keyup", e => this.keyup( e ) )

        this.player.main = true
        this.player.heal = 0
        this.player.damage = 0
    }

    get pawns() {
        return [ this.player, this.enemy ]
    }

    keyup( e: KeyboardEvent ) {
        let { deck, hand } = this
        if ( e.key == "Enter" ) {
            if ( hand.length == 0 && deck.length > 0 )
                this.endTurn()
        }
    }

    endTurn() {
        let { enemy, enemySprites, enemyCount, win, player, melter, deck } = this

        //if enemy health is alive
        if ( enemy.health > 0 ) {
            player.dealDamage( enemy.damage )
            enemy.damage += 2
            enemy.heal += 1
            enemy.health += enemy.heal
            if ( enemy.damage == 0 ) {
                enemy.offset.x = -60
                player.offset.x = -20
            }
        } else {
            this.enemyCount += 1
            this.newEncounter()
        }

        //Player Passive Stats
        player.health += player.heal
        //end turn animations
        if ( enemy.sprite )
            animateSprite( enemy.sprite, 300, 5 )
        if ( player.sprite )
            animateSprite( player.sprite, 200, 1 )

        if ( player.health <= 0 ) {
            window.setTimeout( () => { location.reload() }, 5000 )
        } else {
            this.refillHand()
        }

        let product = melter.product
        console.log( "Crafted " + product.type.name )
        deck.cards.push( product )
        melter.base = new Card( melter.position, CardTypes.Volatile )
        melter.ingredients = []
    }

    newEncounter() {
        let { enemyCount, enemy, enemySprites } = this
        let newHealth = ( enemyCount + 1 ) * 10
        enemy.heal = enemyCount * 2
        enemy.damage = enemyCount * 4
        enemy.health = newHealth
        enemy.maxHealth = newHealth
        // random enemy sprite pulled from list.
        let randomSprite = Math.floor( Math.random() * enemySprites.length )
        enemy.sprite = enemySprites[ randomSprite ]
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
        if ( enemy.health > enemy.maxHealth )
            enemy.health = enemy.maxHealth
        if ( enemy.health < 0 )
            enemy.health = 0
        if ( player.health > player.maxHealth )
            player.health = player.maxHealth
        if ( player.health < 0 )
            player.health = 0

        //BackgroundEffect
        let colorCap = 100
        if ( this.backgroundBlue > colorCap ) {
            this.backgroundBlue -= 10
            this.backgroundRed -= 10
        }
        else {
            this.backgroundBlue += 0.1
            this.backgroundRed += 0.1
        }
        enemy.updateToFixed()

        hand.updateToFixed()
        discard.updateToFixed()
        deck.updateToFixed()

        for ( let card of hand.cards )
            card.update( this )

        if ( !buttons.Mouse0 && hand.length > 0 )
            for ( let card of hand.cards )
                card.grabbed = false

        if ( this.ambience.paused )
            playAudio( this.ambience )

        if ( this.tunes.paused )
            playAudio( this.tunes )
    }

    updateCameraShake( time: number ) {
        let frequency = 100

        let t = Math.max( time, 0 )
        let magnitude = Math.pow( t, 0.5 )

        let shakeOffset = new Vector(
            Math.cos( t * frequency / 7 ),
            Math.sin( t * frequency / 13 )
        ).multiply( magnitude )
        let angle = Math.sin( t ) * magnitude * 0.001

        this.globalTransform = new Transform(
            Canvas.center.add( shakeOffset ),
            angle,
            Vector.ONE,
            Canvas.center
        )
    }

    transformTest() {
        let t = performance.now() / 100
        let s = GMath.lerp( 0.75, Math.sin( t / 2 ), 0.1 )
        this.globalTransform = new Transform(
            Canvas.center,
            GMath.degreesToRadians * t,
            new Vector( s, s ),
            Canvas.center,
            new Transform(
                Canvas.center, 0, new Vector( 1, 0.6 ), Canvas.center
            )
        )
    }

    render() {
        let { deck, enemyCount, hand, discard } = this

        Canvas.resize( 700, 500, 2 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( `rgb(${this.backgroundRed}, ${this.backgroundGreen}, ${this.backgroundBlue})` )

        this.updateCameraShake( this.player.damageTime-- )
        Canvas.transform( this.globalTransform )

        let backgroundY = 150
        Canvas.rect( 0, backgroundY, Canvas.dimensions.x, Canvas.dimensions.y )
            .fillStyle( "rgb(100, 100, 100" )
            .fill()
        Canvas.image( getImage( "Ground" ), 0, backgroundY - 5, Canvas.canvas.clientWidth, 200 )
        Canvas.image( getImage( "BackGroundMid" ), 0, 0, Canvas.canvas.clientWidth, backgroundY )

        //Level Count
        Canvas.fillStyle( "rgb(255, 0, 0)" )
            .text( "level" + enemyCount, Canvas.canvas.clientWidth / 2 - 45, 30, 100, "40px pixel" );


        for ( let pawn of this.pawns )
            pawn.draw()

        deck.draw()
        discard.draw()
        hand.draw( false )
        this.melter.draw()

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