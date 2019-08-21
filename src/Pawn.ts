import Vector, { vector } from "./common/Vector";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";

export default class Pawn extends GameObject {

    offset: Vector
    color: string
    health: number

    constructor( x, y, width, height, color = "red", health = 10 ) {
        super( vector( x, y ), width, height )
        this.offset = vector( 0, 0 )
        this.color = color
        this.health = health
        this.sprite = null
    }

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
            sprite.draw( x + width / 2 + dx, y + height / 2 + dy, true )
        } else {
            this.drawBasic()
        }
        this.drawHealthBar()
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
        let healthWidth = this.health * 10
        let healthPos = this.position.addY( this.height + 5 )
        let healthNumPos = healthPos.addXY( healthWidth / 3, healthHeight - 2 )

        Canvas.rect(
            healthPos.x, healthPos.y,
            healthWidth, healthHeight
        ).fillStyle( "red" ).fill().stroke()

        Canvas.fillStyle( "black" )
            .text(
                this.health.toString(),
                healthNumPos.x, healthNumPos.y,
                25, "25px pixel"
            )
    }

}