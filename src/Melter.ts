import Vector from "./common/Vector";
import Card from "./Card";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";

export default class Melter extends GameObject {
    colors: string[]
    base: Card

    constructor( x: number, y: number ) {
        super( new Vector( x, y ), 200, 130 )
        this.colors = []
        this.base = new Card( this.position, "grey" )
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

    melt( card: Card ) {
        this.colors.push( card.color )
    }

    draw() {
        let margin = ( this.height - this.product.height ) / 2
        let pos = this.position.addXY( -this.product.width, -margin )
        Canvas.rect( pos.x, pos.y, this.width, this.height )
            .fillStyle( "black" ).fill()
        Canvas.rect( this.position.x, this.position.y, this.product.width, this.product.height )
            .fillStyle( "blue" ).fill()
    }
}