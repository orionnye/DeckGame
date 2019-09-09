import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Sprite from "geode/lib/graphics/Sprite";
import Vector, { vector } from "geode/lib/math/Vector";
import { getImage } from "geode/lib/assets";
import MutableVector from "geode/lib/math/MutableVector";
import Scene from "geode/lib/gameobject/Scene";
import GMath from "geode/lib/math/GMath";
import { playSound } from "geode/lib/audio";

export default class Pawn extends GameObject {

    color: string
    sprite?: Sprite
    health: number
    maxHealth: number
    damage: number
    heal: number
    main: boolean
    // This is just for camera shake animation
    damageTime: number

    constructor( x, y, width, height, color = "red", health = 10, sprite: Sprite ) {
        super( vector( x, y ), width, height )
        this.color = color
        this.health = health
        this.maxHealth = health
        this.damage = 10
        this.heal = 2
        this.main = false
        this.sprite = sprite
        this.damageTime = 0
    }
    //ADD ENEMY ACTIONS AND ACTIONLIST TO SPICE THINGS UP A BIT

    addHealth( amount: number ) {
        this.health += amount
        this.health = GMath.clamp( this.health, 0, this.maxHealth )
    }

    dealDamage( amount: number ) {
        this.damageTime = Math.max( 0, amount * 2 )
        this.addHealth( -amount )
    }

    onRender( scene: Scene ) {
        if ( this.sprite ) {
            let { sprite, height } = this
            sprite.draw( sprite.width / 2, height / 2, true )
        } else {
            this.drawBasic()
        }
        this.drawHealthBar()
        this.drawIntent()
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