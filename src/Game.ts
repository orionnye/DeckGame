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
import Background from "./Background";

export default class Game {

    win = false
    handCap = 5
    enemyCount = 0
    grabbing?: Card
    backgroundColor = rgb( 0, 0, 255 )

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

    background = new Background()
    melter = new Melter( 325, 375 )
    enemy = new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 0 ] )
    player = new Pawn(
        100, 80, 100, 100, "red", 60,
        new Sprite( getImage( "PawnEgor" ) )
            .setSource( { x: 0, y: 0, w: 180, h: 132 } )
            .setDimensions( 208, 158 )
    )

    ambience = audioInstance(
        getAudio( "DungeonAmbience" ),
        { volume: 0.3 * 0 }
    )

    tunes = audioInstance(
        getAudio( "DungeonTunes" ),
        { volume: 0.35 * 0 }
    )

    canvas: Canvas

    static instance: Game
    constructor() {
        Game.instance = this

        this.canvas = new Canvas( "canvas" )

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
            player.health -= enemy.damage
            playSound( "slap.wav" )
            enemy.damage += 2
            enemy.heal += 1
            enemy.health += enemy.heal
        } else {
            this.enemyCount += 1
            this.newEncounter()
        }

        //Player Passive Stats
        if ( player.heal < 0 )
            player.heal += 1
        if ( player.heal > 0 ) {
            player.heal -= 1
        }

        player.health += player.heal
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
        let { canvas, deck, hand, discard, enemy, player, melter, background } = this

        let scene = new Scene( canvas, this.cameraTransform(), [ player, enemy, deck, hand, discard, melter, background ] )

        //  Rendering in update function? Seems odd
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

    cameraTransform() {
        let { canvas } = this
        let dizzyTime = GMath.soften( this.player.dizzyTime / 4, 20 )
        let s = GMath.lerp( 1, Math.cos( dizzyTime / 4 ), 0.1 )
        let dizzyTransform = new Transform(
            canvas.center,
            Math.sin( dizzyTime / 13 ) * GMath.TAU / 8,
            new Vector( 1 / s, 1 / s ),
            canvas.center,
            new Transform(
                canvas.center, 0, new Vector( 1, 1 / Math.cos( dizzyTime * 0.1 ) ), canvas.center
            )
        )

        const frequency = 20
        let damageTime = this.player.damageTime
        let magnitude = Math.sqrt( damageTime )
        let offset = Vector.lissajous( damageTime * frequency, 7, 13, magnitude )
        let angle = Math.sin( damageTime ) * magnitude * 0.001
        let cameraShakeTransform = new Transform(
            canvas.center.add( offset ),
            angle,
            Vector.ONE,
            canvas.center,
            dizzyTransform
        )
        return cameraShakeTransform
    }

    render( scene: Scene ) {
        let { canvas } = this

        canvas.resize( 700, 500, 2 )

        canvas.context.imageSmoothingEnabled = false
        canvas.background( this.backgroundColor )

        scene.cameraTransform = this.cameraTransform()
        scene.render()

        if ( this.player.damageTime > 0 )
            canvas.background( rgba( 255, 0, 0, Math.sqrt( this.player.damageTime / 160 ) ) )

        if ( this.player.health <= 0 ) {
            canvas.fillStyle( rgb( 100, 0, 0 ) )
            let deathMessageWidth = 700
            let deathMessageX = canvas.canvas.clientWidth / 2 - deathMessageWidth / 2
            let deathMessageY = canvas.canvas.clientHeight / 2 - 30
            canvas.text( "YOU DIED ON LEVEL " + this.enemyCount, deathMessageX, deathMessageY, deathMessageWidth, "250px pixel" );
        }

        if ( this.win ) {
            canvas.fillStyle( rgb( 0, 0, 100 ) )
            let winMessageWidth = 700
            let winMessageX = canvas.canvas.clientWidth / 2 - winMessageWidth / 2
            let winMessageY = canvas.canvas.clientHeight / 2
            canvas.text( "YOU WIN", winMessageX, winMessageY, winMessageWidth, "400px pixel" );
        }
    }
}