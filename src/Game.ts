import Canvas from "geode/lib/graphics/Canvas"
import Deck from "./Deck"
import Pawn from "./Pawn"
import Card from "./Card"
import Melter from "./Melter"
import CardTypes from "./CardTypes"
import { playAudio, audioInstance, playSound } from "geode/lib/audio"
import { getImage, getAudio } from "geode/lib/assets"
import Transform from "geode/lib/math/Transform"
import Vector, { vector } from "geode/lib/math/Vector"
import GMath from "geode/lib/math/GMath"
import { rgb, rgba } from "geode/lib/graphics/Color"
import Scene from "geode/lib/gameobject/Scene"
import { scheduleTask } from "./util"
import Background from "./Background"
import SpriteSheet from "geode/lib/graphics/SpriteSheet"
import { getEnemy, newEncounter } from "./enemies"
import { GameClock } from "geode/lib/Clock"
import Animator from "geode/lib/graphics/Animator"
import Ledger from "./Ledger"

export default class Game {

    win = false
    handCap = 5
    enemyCount = 0
    grabbing?: Card
    backgroundColor = rgb( 0, 0, 255 )

    deck = new Deck( 10, Infinity, 30, 250, -1, 1, false )
    hand = new Deck( this.handCap, this.handCap, 145, 250, 90, 0, true )
    discard = new Deck( 0, Infinity, 600, 250, 1, 1, false )

    background = new Background()
    melter = new Melter( 325, 375 )
    ledger = new Ledger(100, 390)
    enemy = getEnemy( 0 )
    player = new Pawn(
        vector( 100, 80 ),
        60,
        new Animator(
            new SpriteSheet( {
                image: getImage( "PawnEgor" ),
                center: vector( 18, 38 ),
                frameWidth: 90,
                scale: 2.4
            } )
        )
    )

    ambience = audioInstance( getAudio( "DungeonAmbience" ), { volume: 0.025 * 1 } )
    tunes = audioInstance( getAudio( "SomberTune.wav" ), { volume: 0.75 * 1 } )

    canvas: Canvas

    static instance: Game
    constructor() {
        Game.instance = this
        this.canvas = new Canvas( "canvas" )
        this.player.main = true
        this.player.heal = 0
        this.player.damage = 0
        addEventListener( "keyup", e => this.keyup( e ) )
    }

    get pawns() { return [ this.player, this.enemy ] }

    keyup( e: KeyboardEvent ) {
        if ( e.key == "Enter" )
            this.tryEndTurn()
        if ( e.key == "e" )
            this.player.animator.play( 1000 )
    }

    get canEndTurn() {
        let { deck, hand, endingTurn } = this
        return !endingTurn && hand.length == 0 && deck.length > 0 && this.player.health > 0
    }

    endingTurn = false
    tryEndTurn() {
        if ( !this.canEndTurn ) return
        this.endingTurn = true

        let { enemy, player, melter, deck } = this

        enemy.onEndTurn(player, enemy)
        player.statDecay()
        
        //if enemy health is alive
        if ( enemy.health > 0 ) {
            playSound( "slap.wav", { volume: 0.1 } )
        } else {
            this.enemyCount += 1
            this.enemy = newEncounter( this.enemyCount )
        }

        if ( enemy.animator )
            enemy.animator.play( 1000 )

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

        let scene = new Scene( canvas, this.cameraTransform(), [ player, enemy, deck, hand, discard, melter, background, this.ledger] )
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