import Card from "./Card";
import CardType from "./CardType";
import CardTypes from "./CardTypes";
import CookBook from "./CookBook";

import GameObject from "geode/GameObject";
import Canvas from "geode/Canvas";
import { vector, getImage } from "geode";
import Sprite from "geode/Sprite";

export default class Melter extends GameObject {
    ingredients: CardType[]
    base: Card

    constructor( x: number, y: number ) {
        super( vector( x, y ), 69, 100 )
        this.ingredients = []
        this.base = new Card( this.position, CardTypes.Volatile )
        this.sprite = new Sprite( getImage( "BrewStation" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( 200, 200 )
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
        let margin = vector( 32, 45 )
        // Canvas.vrect( this.position.subtract( margin.half ), this.dimensions.add( margin ) )
        //     .fillStyle( "black" ).fill()
        // Canvas.vrect( this.position, this.product.dimensions )
        //     .fillStyle( "blue" ).fill()
        if ( this.sprite ) {
            let { sprite, position, width, height } = this
            let { x, y } = position
            sprite.draw( x + margin.x, y + margin.y, true )
        }
    }
}