import Vector, { vector } from "./common/Vector";
import Card from "./Card";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";

export default class Melter extends GameObject {
    colors: string[]
    base: Card

    constructor( x: number, y: number ) {
        // super( vector( x, y ), 200, 130 )
        super( vector( x, y ), 69, 100 )
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
        let margin = vector( 100, 30 )
        Canvas.vrect( this.position.subtract( margin.half ), this.dimensions.add( margin ) )
            .fillStyle( "black" ).fill()
        Canvas.vrect( this.position, this.product.dimensions )
            .fillStyle( "blue" ).fill()
    }
}