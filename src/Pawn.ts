import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Sprite from "geode/lib/graphics/Sprite";
import Vector, { vector } from "geode/lib/math/Vector";
import { getImage } from "geode/lib/assets";
import Scene from "geode/lib/gameobject/Scene";
import GMath from "geode/lib/math/GMath";
import Color from "geode/lib/graphics/Color";

export default class Pawn extends GameObject {

    dizzyTime: number = 0
    dizziness: number = 0
    recentDamage = 0
    damageTime = 0
    private pHealth: number = 10
    maxHealth: number
    damage: number
    heal: number
    main: boolean
    sprite?: Sprite = new Sprite( getImage( "Archlizard" ) )
        .setSource( { x: 0, y: 0, w: 100, h: 50 } )
        .setDimensions( 150, 70 )
    frameCount: number = 2

    layer = -50

    constructor( position, width, height, health, sprite, frameCount ) {
        super( position, width, height )
        this.maxHealth = health
        this.pHealth = health
        this.damage = 10
        this.heal = 2
        this.main = false
        this.sprite = sprite
        this.frameCount = frameCount
    }

    get health() { return this.pHealth }
    set health( value: number ) {
        let increase = value - this.pHealth
        this.pHealth = GMath.clamp( value, 0, this.maxHealth )
        if ( increase < 0 )
            this.onDamage( -increase )
    }

    onDamage( amount: number ) {
        this.recentDamage += amount
        this.damageTime += amount * 2
    }

    onUpdate() {
        this.recentDamage = Math.max( 0, this.recentDamage - 0.15 )
        this.damageTime = Math.max( 0, this.damageTime - 1 )
        this.dizzyTime = Math.max( 0, this.dizzyTime - 1 )

        if ( this.dizzyTime == 0 )
            this.dizziness = 0
    }

    onEndTurn() {
        if ( this.health > 0 )
            this.health += this.heal
    }

    onRender( canvas: Canvas, scene: Scene ) {
        canvas.vtranslate(
            Vector.lissajous(
                this.damageTime * 10,
                7, 13, Math.sqrt( this.damageTime )
            )
        )

        if ( this.sprite )
            this.sprite.draw( canvas, this.sprite.width / 2, this.height / 2, true )
        else
            this.drawBasic( canvas )

        this.drawHealthBar( canvas )
        this.drawIntent( canvas )
    }

    drawBasic( canvas: Canvas ) {
        canvas.vrect(
            Vector.ZERO,
            this.dimensions
        ).fillStyle( Color.magenta ).fill()
    }

    drawHealthBar( canvas: Canvas ) {
        let healthHeight = 20
        let textWidth = 60
        let healthChunk = this.width / this.maxHealth
        let healthWidth = this.health * healthChunk
        let healthPos = vector( 0, this.height + 40 )
        let healthNumPos = healthPos.addXY( healthWidth / 3 - textWidth / 4, healthHeight - 2 )
        let damageWidth = this.recentDamage * healthChunk

        canvas.vrect( healthPos, vector( this.width, healthHeight ) ).fillStyle( Color.black ).fill()
        canvas.vrect( healthPos, vector( healthWidth, healthHeight ) ).fillStyle( Color.red ).fill()
        canvas.vrect( healthPos.addX( healthWidth ), vector( damageWidth, healthHeight ) ).fillStyle( Color.orange ).fill()
        // canvas.vrect( healthPos, vector( this.width, healthHeight ) ).fillStyle( "black" ).stroke()

        canvas.fillStyle( "white" )
            .text(
                this.health.toString() + "/" + this.maxHealth.toString(),
                healthNumPos.x, healthNumPos.y,
                textWidth, "20px pixel"
            )
    }

    drawIntent( canvas: Canvas ) {
        canvas.fillStyle( "orange" )
            .text(
                "Attack  " + this.damage.toString() + "",
                0, -20,
                120, "25px pixel"
            )
        canvas.fillStyle( "green" )
            .text(
                "Regenerate  " + this.heal.toString() + "",
                0, 0,
                120, "20px pixel"
            )
    }
}