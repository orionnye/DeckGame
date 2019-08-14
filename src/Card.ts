import Vector from "./Vector";

export default class Card {

    position: Vector
    width: number
    height: number
    color: string
    grabbed: boolean

    constructor( position: Vector, color = "red" ) {
        this.position = position
        this.width = 69
        this.height = 100
        this.color = color
        this.grabbed = false
    }

    contains( point: Vector ) {
        if ( point.x < this.position.x + this.width && point.x > this.position.x ) {
            if ( point.y < this.position.y + this.height && point.y > this.position.y ) {
                return true
            }
        }
        return false
    }
}