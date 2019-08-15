import Vector from "./common/Vector";
import Card from "./Card";
import Canvas from "./common/Canvas";

export default class Melter {
    position: Vector
    colors: string[]
    base: Card
    width: number
    height: number

    constructor( x: number, y: number ) {
        this.position = new Vector( x, y )
        this.colors = []
        this.base = new Card( this.position, "grey" )
        this.width = 200
        this.height = 130
    }

    get product() {
        if ( this.colors.length == 0 ) {
            return this.base
        }
        let endColor = ""
        this.colors.forEach( color => {
            let compColor = endColor.toString() + color.toString()
            endColor = compColor
        } )
        let concoction = new Card( this.base.position, endColor )
        return concoction
    }

    contains( card: Card ) {
        let { position, base } = this
        //  check card for collision
        let upLeft = position
        let lowLeft = new Vector( position.x, position.y + base.height )
        let upRight = new Vector( position.x + base.width, position.y )
        let lowRight = new Vector( position.x + base.width, position.y + base.height )
        if ( !card.grabbed ) {
            if ( card.contains( upLeft ) || card.contains( lowLeft ) ) {
                return true
            }
            if ( card.contains( upRight ) || card.contains( lowRight ) ) {
                return true
            }
        }
        return false
    }

    melt( card: Card ) {
        this.colors.push( card.color )
    }

    draw() {
        let margin = ( this.height - this.product.height ) / 2
        Canvas.rect( this.position.x - this.product.width, this.position.y - margin, this.width, this.height )
            .fillStyle( "black" ).fill()
        Canvas.rect( this.position.x, this.position.y, this.product.width, this.product.height )
            .fillStyle( "blue" ).fill()
    }
}