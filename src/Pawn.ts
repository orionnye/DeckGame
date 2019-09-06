import Canvas from "geode/lib/Canvas";
import GameObject from "geode/lib/GameObject";
import Sprite from "geode/lib/Sprite";
import Vector, { vector } from "geode/lib/Vector";
import { getImage } from "geode/lib/assets";

export default class Pawn extends GameObject {

    offset: Vector
    color: string
    sprite?: Sprite
    health: number
    maxHealth: number
    damage: number
    heal: number
    main: boolean

    constructor( x, y, width, height, color = "red", health = 10 , sprite: Sprite) {
        super( vector( x, y ), width, height )
        this.offset = vector( 0, 0 )
        this.color = color
        this.health = health
        this.maxHealth = health
        this.damage = 10
        this.heal = 2
        this.main = false
        this.sprite = sprite
    }
    //ADD ENEMY ACTIONS AND ACTIONLIST TO SPICE THINGS UP A BIT

    updateToFixed() {
        if ( this.offset.length > 0 ) {
            this.offset
            if ( this.position.subtract( this.offset ).length > 2 ) {
                let fixVector = vector( 0, 0 ).subtract( this.offset )
                this.offset = fixVector.unit.multiply( fixVector.length / 2 )
            }
            if ( this.offset.length < 3 )
                this.offset = vector( 0, 0 )
        }
    }

    draw() {
        if ( this.sprite ) {
            let { sprite, position, width, height } = this
            let { x, y } = position
            let { x: dx, y: dy } = this.offset
            sprite.draw( x + sprite.width / 2 + dx, y + height / 2 + dy, true )
        } else {
            this.drawBasic()
        }
        
        this.drawHealthBar()
        this.drawIntent()
    }

    drawBasic() {
        Canvas.vrect(
            this.position.add( this.offset ),
            this.dimensions
        ).fillStyle( this.color ).fill()

        if ( this.health <= 0 )
            Canvas.fillStyle( "black" ).text(
                "Dead",
                this.position.x + this.offset.x, this.position.y + this.offset.y + this.height / 2,
                this.width
            )
    }

    drawHealthBar() {
        let healthHeight = 20
        let textWidth = 60
        let healthChunk = this.width / this.maxHealth
        let healthWidth = this.health * healthChunk
        let healthPos = this.position.addY( this.height + 40 )
        let healthNumPos = healthPos.addXY( healthWidth / 3 - textWidth / 4, healthHeight - 2 )

        Canvas.rect(
            healthPos.x, healthPos.y,
            this.width, healthHeight
        ).fillStyle( "black" ).fill().stroke()
        Canvas.rect(
            healthPos.x, healthPos.y,
            healthWidth, healthHeight
        ).fillStyle( "red" ).fill().stroke()
        Canvas.fillStyle( "white" )
            .text(
                this.health.toString() + "/" + this.maxHealth.toString(),
                healthNumPos.x, healthNumPos.y,
                textWidth, "25px pixel"
            )
    }
    drawIntent() {
        Canvas.fillStyle( "orange" )
        .text(
            "ATTACK  " + this.damage.toString() + "",
            this.position.x, this.position.y - 20,
            100, "25px pixel"
        )
        Canvas.fillStyle( "green" )
        .text(
            "REGENERATE  " + this.heal.toString() + "",
            this.position.x, this.position.y,
            120, "25px pixel"
        )
    }
 }