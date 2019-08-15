import Vector from "./common/Vector";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";

export default class Pawn extends GameObject {

    offset: Vector
    color: string
    health: number

    constructor( x, y, width, height, color = "red" ) {
        super( new Vector( x, y ), width, height )
        this.offset = new Vector( 0, 0 )
        this.color = color
        this.health = 10
        this.sprite = null
    }

    updateToFixed() {
        if ( this.offset.length > 0 ) {
            this.offset
            if ( this.position.subtract( this.offset ).length > 2 ) {
                let fixVector = new Vector( 0, 0 ).subtract( this.offset )
                this.offset = fixVector.unit.multiply( fixVector.length / 2 )
            }
            if ( this.offset.length < 3 )
                this.offset = new Vector( 0, 0 )
        }
    }

    draw() {
        if ( this.sprite ) {
            let { sprite, position, width, height } = this
            let { x, y } = position
            sprite.draw( x + width / 2, y + height / 2, true )
        } else {
            this.drawBasic()
        }
        this.drawHealthBar()
    }

    drawBasic() {
        Canvas.rect(
            this.position.x + this.offset.x, this.position.y + this.offset.y,
            this.width, this.height
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
        let healthPos = new Vector( this.position.x, this.position.y + this.height + 5 )
        let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )

        Canvas.rect(
            healthPos.x, healthPos.y,
            healthWidth, healthHeight
        ).fillStyle( "red" ).fill().stroke()

        Canvas.fillStyle( "black" )
            .text(
                this.health.toString(),
                healthNumPos.x, healthNumPos.y,
                25, "25px timesNewRoman"
            )
    }

}