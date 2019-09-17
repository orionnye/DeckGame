import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Vector, { vector } from "geode/lib/math/Vector";
import Scene from "geode/lib/gameobject/Scene";
import GMath from "geode/lib/math/GMath";
import Color from "geode/lib/graphics/Color";
import Animator from "geode/lib/graphics/Animator";
import MoveType from "./MoveType"
import MoveTypes from "./MoveTypes"

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
    animator: Animator
    moveList?: MoveType[]

    layer = -50

    constructor( position, health, animator, moveList? ) {
        super( position, 100, 140 )
        this.maxHealth = health
        this.pHealth = health
        this.damage = 10
        this.heal = 2
        this.main = false
        this.animator = animator
        this.moveList = moveList
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
        //Add enemyturn here, and select random move from move list to use
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

        // this.drawBasic( canvas )
        if ( this.animator ) {
            let { width, height } = this
            canvas.push().translate( width / 2, height / 2 )
            this.animator.onRender( canvas )
            canvas.pop()
        } else {
            this.drawBasic( canvas )
        }

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
        let healthPos = vector( 0, this.height )
        let healthNumPos = healthPos.addXY( healthWidth / 3 - textWidth / 4, healthHeight - 2 )
        let damageWidth = this.recentDamage * healthChunk
        let healSign = this.heal < 0 ? "" : "+"

        canvas.vrect( healthPos, vector( this.width, healthHeight ) ).fillStyle( Color.black ).fill()
        canvas.vrect( healthPos, vector( healthWidth, healthHeight ) ).fillStyle( Color.red ).fill()
        canvas.vrect( healthPos.addX( healthWidth ), vector( damageWidth, healthHeight ) ).fillStyle( Color.orange ).fill()

        canvas.fillStyle( "white" )
            .text(
                this.health + "/" + this.maxHealth,
                healthNumPos.x, healthNumPos.y,
                textWidth, "20px pixel"
            )
        if ( this.heal !== 0 && this.health > 0 && this.health !== this.maxHealth) {
            canvas.fillStyle( "green" )
                .text(
                    healSign + this.heal,
                    healthNumPos.x + textWidth + 5, healthNumPos.y,
                    textWidth, "20px pixel"
                )
        }
    }

    drawIntent( canvas: Canvas ) {
        if ( this.damage !== 0 ) {
            canvas.fillStyle( "orange" )
                .text(
                    "Attack " + this.damage + "",
                    0, -10,
                    120, "25px pixel"
                )
        }
    }
}