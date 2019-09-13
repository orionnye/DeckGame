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

    deck = new Deck( 10, Infinity, 30, 250, -1, 1, false )
    hand = new Deck( this.handCap, this.handCap, 145, 250, 90, 0, true )
    discard = new Deck( 0, Infinity, 600, 250, 1, 1, false )

    enemySprites = [
        new Sprite( getImage( "PawnChadwick2" ) )
            .setSource( { x: 0, y: 0, w: 1000, h: 1000 } )
            .setDimensions( 120, 120 ),
        new Sprite( getImage( "Archlizard" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 50 } )
            .setDimensions( 150, 70 ),
        new Sprite( getImage( "BoneDragon" ) )
            .setSource( { x: 0, y: 0, w: 80, h: 100 } )
            .setDimensions( 130, 130 ),
        new Sprite( getImage( "Noodle" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( 130, 130 )
    ]

    enemies = [
        new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 1 ], 2 ),
        new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 2 ], 1 ),
        new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 3 ], 9 )
    ]


    background = new Background()
    melter = new Melter( 325, 375 )
    enemy = new Pawn( 520, 80, 100, 100, "blue", 15, this.enemySprites[ 0 ], 6 )
    player = new Pawn(
        100, 80, 100, 100, "red", 60,
        new Sprite( getImage( "PawnEgor" ) )
            .setSource( { x: 0, y: 0, w: 180, h: 132 } )
            .setDimensions( 208, 158 ),
        9
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
        let { deck, hand, endingTurn } = this
        return !endingTurn && hand.length == 0 && deck.length > 0 && this.player.health > 0
    }

    endingTurn = false
    tryEndTurn() {
        if ( !this.canEndTurn )
            return

        this.endingTurn = true

        let { enemy, enemySprites, enemyCount, win, player, melter, deck } = this

        player.onEndTurn()
        enemy.onEndTurn()

        //if enemy health is alive
        if ( enemy.health > 0 ) {
            player.health -= enemy.damage
            playSound( "slap.wav" )
            enemy.damage += 2
            enemy.heal += 1
        } else {
            this.enemyCount += 1
            this.newEncounter()
        }

        player.heal -= Math.sign( player.heal )

        //end turn animations
        if ( enemy.sprite )
            animateSprite( enemy.sprite, 300, enemy.frameCount )
        if ( player.sprite )
            animateSprite( player.sprite, 200, 1 )

        if ( player.health <= 0 )
            window.setTimeout( () => { location.reload() }, 5000 )
        else
            this.refillHand()

        for ( let product of melter.products )
            deck.cards.push( product )

        melter.base = new Card( melter.position, CardTypes.Volatile )
        melter.ingredients = []

        this.endingTurn = false
    }

    newEncounter() {
        let { enemyCount, enemy, enemySprites, enemies } = this
        let newHealth = ( enemyCount + 1 ) * 10
        // random enemy sprite pulled from list.
        let randomEnemy = Math.floor( Math.random() * enemies.length )
        this.enemy = enemies[ randomEnemy ]

        //stat changes will be obsolete with proper enemy planning, keeping it for now to increase gamelength
        enemy.heal = enemyCount * 2
        enemy.maxHealth = newHealth
        enemy.health = enemy.maxHealth
        enemy.damage = enemyCount * 4
    }

    refillHand() {
        let { deck, hand, discard, handCap } = this

        let delay = 6
        while ( hand.length < handCap && ( deck.length > 0 || discard.length > 0 ) ) {
            if ( deck.length == 0 )
                while ( discard.length > 0 )
                    discard.transferCard( deck, ( delay++ ) * 5 )
            else
                deck.transferCard( hand, ( delay++ ) * 5 )
        }
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

    // ---- Rendering ----

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

        canvas.smooth( false )
        canvas.background( this.backgroundColor )

        scene.cameraTransform = this.cameraTransform()
        scene.render()

        if ( this.player.damageTime > 0 )
            canvas.background( rgba( 255, 0, 0, Math.sqrt( this.player.damageTime / 160 ) ) )

        if ( this.player.health <= 0 ) {
            canvas.fillStyle( rgb( 100, 0, 0 ) )
            let messageWidth = 700
            let messagePos = canvas.dimensions.half.addXY( -messageWidth / 2, -30 )
            canvas.text( "YOU DIED ON LEVEL " + this.enemyCount, messagePos.x, messagePos.y, messageWidth, "250px pixel" );
        }

        if ( this.win ) {
            canvas.fillStyle( rgb( 0, 0, 100 ) )
            let messageWidth = 700
            let messagePos = canvas.dimensions.half.addX( -messageWidth / 2 )
            canvas.text( "YOU WIN", messagePos.x, messagePos.y, messageWidth, "400px pixel" );
        }
    }
}