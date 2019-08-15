import Vector from "./common/Vector";
import Canvas from "./common/Canvas";

export default class Pawn {

    position: Vector
    offset: Vector
    width: number
    height: number
    color: string
    health: number

    constructor( x, y, width, height, color = "red" ) {
        this.position = new Vector( x, y )
        this.offset = new Vector( 0, 0 )
        this.width = width
        this.height = height
        this.color = color
        this.health = 10
    }

    collidesWith( other ) {
        let myCenter = new Vector( this.position.x + this.width / 2, this.position.y + this.height / 2 )
        let otherCenter = new Vector( other.position.x + other.width / 2, other.position.y + other.height / 2 )
        let distance = otherCenter.subtract( myCenter ).length
        if ( distance < this.width ) {
            return true
        } else {
            return false
        }
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
        Canvas.rect(
            this.position.x + this.offset.x, this.position.y + this.offset.y,
            this.width, this.height
        ).fillStyle( this.color ).fill()
        if ( this.health <= 0 ) {
            Canvas.text(
                "Dead",
                this.position.x + this.offset.x, this.position.y + this.offset.y + this.height / 2,
                this.width
            )
        }
        this.drawHealthBar()
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