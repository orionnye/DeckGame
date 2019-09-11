import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Sprite from "geode/lib/graphics/Sprite";
import Vector, { vector } from "geode/lib/math/Vector";
import { getImage } from "geode/lib/assets";
import Scene from "geode/lib/gameobject/Scene";
import GMath from "geode/lib/math/GMath";

export default class Pawn extends GameObject {

    color: string
    private pDamageTime: number
    private pHealth: number
    maxHealth: number
    damage: number
    heal: number
    main: boolean
    sprite?: Sprite = new Sprite( getImage( "Archlizard" ) )
        .setSource( { x: 0, y: 0, w: 100, h: 50 } )
        .setDimensions( 150, 70 )

    constructor( x, y, width, height, color = "red", health = 10, sprite ) {
        super( vector( x, y ), width, height )
        this.color = color
        this.maxHealth = health
        this.pHealth = health
        this.damage = 10
        this.heal = 2
        this.main = false
        this.sprite = sprite
        this.pDamageTime = 0
    }

    get damageTime() { return this.pDamageTime }
    set damageTime( value ) { this.pDamageTime = Math.max( 0, value ) }

    get health() { return this.pHealth }
    set health( value: number ) {
        let increase = value - this.pHealth
        this.pHealth = GMath.clamp( value, 0, this.maxHealth )
        if ( increase < 0 )
            this.onDamage( -increase )
    }

    onDamage( amount: number ) {
        this.damageTime = Math.max( 0, amount * 2 )
    }

    onRender( scene: Scene ) {
        Canvas.vtranslate(
            Vector.lissajous(
                this.damageTime * 10,
                7, 13, Math.sqrt( this.damageTime )
            )
        )

        if ( this.sprite ) {
            let { sprite, height } = this
            sprite.draw( sprite.width / 2, height / 2, true )
        } else {
            this.drawBasic()
        }
        this.drawHealthBar()
        this.drawIntent()
    }

    onUpdate() {
        this.damageTime--
    }

    drawBasic() {
        Canvas.vrect(
            Vector.ZERO,
            this.dimensions
        ).fillStyle( this.color ).fill()
    }

    drawHealthBar() {
        let healthHeight = 20
        let textWidth = 60
        let healthChunk = this.width / this.maxHealth
        let healthWidth = this.health * healthChunk
        let healthPos = vector( 0, this.height + 40 )
        let healthNumPos = healthPos.addXY( healthWidth / 3 - textWidth / 4, healthHeight - 2 )

        Canvas.vrect( healthPos, vector( this.width, healthHeight ) ).fillStyle( "black" ).fill().stroke()
        Canvas.vrect( healthPos, vector( healthWidth, healthHeight ) ).fillStyle( "red" ).fill().stroke()

        Canvas.fillStyle( "white" )
            .text(
                this.health.toString() + "/" + this.maxHealth.toString(),
                healthNumPos.x, healthNumPos.y,
                textWidth, "20px pixel"
            )
    }

    drawIntent() {
        Canvas.fillStyle( "orange" )
            .text(
                "ATTACK  " + this.damage.toString() + "",
                0, 0 - 20,
                100, "25px pixel"
            )
        Canvas.fillStyle( "green" )
            .text(
                "REGENERATE  " + this.heal.toString() + "",
                0, 0,
                120, "25px pixel"
            )
    }
}