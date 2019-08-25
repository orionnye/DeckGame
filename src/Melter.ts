import Vector, { vector } from "./common/Vector";
import Card from "./Card";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";
import CardType from "./CardType";
import CardTypes from "./CardTypes";
import CookBook from "./CookBook";

export default class Melter extends GameObject {
    ingredients: CardType[]
    base: Card

    constructor( x: number, y: number ) {
        super( vector( x, y ), 69, 100 )
        this.ingredients = []
        this.base = new Card( this.position, CardTypes.Volatile )
    }

    get product() {
        let type = CookBook.getProduct( this.ingredients )
        let concoction = new Card( this.base.position, type )
        return concoction
    }

    melt( card: Card ) {
        this.ingredients.push( card.type )
    }

    draw() {
        let margin = vector( 100, 30 )
        Canvas.vrect( this.position.subtract( margin.half ), this.dimensions.add( margin ) )
            .fillStyle( "black" ).fill()
        Canvas.vrect( this.position, this.product.dimensions )
            .fillStyle( "blue" ).fill()
    }
}