import Canvas from "geode/lib/graphics/Canvas";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Card from "./Card";
import Melter from "./Melter";
import Sprite from "geode/lib/graphics/Sprite";
import CardTypes from "./CardTypes";
import { playAudio, audioInstance, playSound } from "geode/lib/audio";
import { getImage, getAudio } from "geode/lib/assets";
import animateSprite from "./animateSprite";
import Transform from "geode/lib/math/Transform";
import Vector, { vector } from "geode/lib/math/Vector";
import GMath from "geode/lib/math/GMath";
import { rgb, rgba } from "geode/lib/graphics/Color";
import Scene from "geode/lib/gameobject/Scene";
import { scheduleTask } from "./util";

export default class Game {

    enemyCount = 0
    deck = new Deck( 10, 30, 250, -1, 1, false )
    hand = new Deck( 5, 145, 250, 90, 0, true )
    discard = new Deck( 0, 600, 250, 1, 1, false )

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

    player = new Pawn(
        100, 80, 100, 100, "red", 60,
        new Sprite( getImage( "PawnEgor" ) )
            .setSource( { x: 0, y: 0, w: 180, h: 132 } )
            .setDimensions( 208, 158 )
    )
    enemy = new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 0 ] )
    melter = new Melter( 325, 375 )

    grabbing?: Card
    win = false
    handCap = 5

    ambience = audioInstance(
        getAudio( "DungeonAmbience" ),
        { volume: 0.0 }
        // { volume: 0.30 }
    )
    tunes = audioInstance(
        getAudio( "DungeonTunes" ),
        { volume: 0.0 }
        // { volume: 0.35 }
    )

    backgroundColor = rgb( 0, 0, 255 )

    static instance: Game

    constructor() {
        Game.instance = this

        addEventListener( "keyup", e => this.keyup( e ) )

        this.player.main = true
        this.player.heal = 0
        this.player.damage = 0
    }

    get pawns() {
        return [ this.player, this.enemy ]
    }

    keyup( e: KeyboardEvent ) {
        if ( e.key == "Enter" )
            this.tryEndTurn()
    }

    get canEndTurn() {
        let { deck, hand } = this
        return hand.length == 0 && deck.length > 0 && this.player.health > 0
    }

    tryEndTurn() {
        if ( !this.canEndTurn )
            return

        let { enemy, enemySprites, enemyCount, win, player, melter, deck } = this

        //if enemy health is alive
        if ( enemy.health > 0 ) {
            player.dealDamage( enemy.damage )
            playSound( "slap", "wav" )
            enemy.damage += 2
            enemy.heal += 1
            enemy.addHealth( enemy.heal )
        } else {
            this.enemyCount += 1
            this.newEncounter()
        }

        //Player Passive Stats
        player.addHealth( player.heal )
        //end turn animations
        if ( enemy.sprite )
            animateSprite( enemy.sprite, 300, 5 )
        if ( player.sprite )
            animateSprite( player.sprite, 200, 1 )

        if ( player.health <= 0 )
            window.setTimeout( () => { location.reload() }, 5000 )
        else
            this.refillHand()

        let product = melter.product
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

        while ( hand.length < handCap && deck.length > 0 )
            deck.transferCard( hand )
    }

    update() {
        let { deck, hand, discard, enemy, player, melter } = this

        let scene = new Scene( [ player, enemy, deck, hand, discard, melter ] )

        this.render( scene )

        scene.update()

        if ( this.canEndTurn )
            scheduleTask( "endTurn", 1000, () => this.tryEndTurn() )

        //BackgroundEffect
        let colorCap = 100
        if ( this.backgroundColor.b > colorCap ) {
            this.backgroundColor.b -= 10
            this.backgroundColor.r -= 10
        }
        else {
            this.backgroundColor.b += 0.1
            this.backgroundColor.r += 0.1
        }

        if ( this.ambience.paused )
            playAudio( this.ambience )

        if ( this.tunes.paused )
            playAudio( this.tunes )
    }

    updateCameraShake( scene: Scene, time: number ) {
        const frequency = 20

        let t = Math.max( time, 0 )
        let magnitude = Math.pow( t, 0.5 )
        let offset = Vector.lissajous( t * frequency, 7, 13, magnitude )
        let angle = Math.sin( t ) * magnitude * 0.001

        scene.globalTransform = new Transform(
            Canvas.center.add( offset ),
            angle,
            Vector.ONE,
            Canvas.center
        )
    }

    transformTest( scene: Scene ) {
        let t = performance.now() / 100
        let s = GMath.lerp( 0.75, Math.sin( t / 2 ), 0.1 )
        scene.globalTransform.parent = new Transform(
            Canvas.center,
            GMath.degreesToRadians * t,
            new Vector( s, s ),
            Canvas.center,
            new Transform(
                Canvas.center, 0, new Vector( 1, Math.sin( t * 0.1 ) ), Canvas.center
            )
        )
    }

    render( scene: Scene ) {
        let { enemyCount } = this

        Canvas.resize( 700, 500, 2 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( this.backgroundColor )

        let backgroundY = 150
        Canvas.rect( 0, backgroundY, Canvas.dimensions.x, Canvas.dimensions.y )
            .fillStyle( rgb( 100, 100, 100 ) )
            .fill()
        Canvas.image( getImage( "Ground" ), 0, backgroundY - 5, Canvas.canvas.clientWidth, 200 )
        Canvas.image( getImage( "BackGroundMid" ), 0, 0, Canvas.canvas.clientWidth, backgroundY )

        //Level Count
        Canvas.fillStyle( rgb( 255, 0, 0 ) )
            .text( "LEVEL" + enemyCount, Canvas.canvas.clientWidth / 2 - 45, 30, 100, "40px pixel" )

        this.updateCameraShake( scene, this.player.damageTime-- )
        // this.transformTest( scene )

        scene.render()

        if ( this.player.damageTime > 0 )
            Canvas.background( rgba( 255, 0, 0, Math.sqrt( this.player.damageTime / 160 ) ) )


        if ( this.player.health <= 0 ) {
            Canvas.fillStyle( rgb( 100, 0, 0 ) )
            let deathMessageWidth = 700
            let deathMessageX = Canvas.canvas.clientWidth / 2 - deathMessageWidth / 2
            let deathMessageY = Canvas.canvas.clientHeight / 2 - 30
            Canvas.text( "YOU DIED ON LEVEL " + this.enemyCount, deathMessageX, deathMessageY, deathMessageWidth, "250px pixel" );
        }

        if ( this.win ) {
            Canvas.fillStyle( rgb( 0, 0, 100 ) )
            let winMessageWidth = 700
            let winMessageX = Canvas.canvas.clientWidth / 2 - winMessageWidth / 2
            let winMessageY = Canvas.canvas.clientHeight / 2
            Canvas.text( "YOU WIN", winMessageX, winMessageY, winMessageWidth, "400px pixel" );
        }
    }
}