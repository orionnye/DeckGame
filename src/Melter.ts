import { getImage } from "geode/lib/assets";
import GameObject from "geode/lib/gameobject/GameObject";
import Sprite from "geode/lib/graphics/Sprite";
import Vector, { vector } from "geode/lib/math/Vector";
import Card from "./Card";
import CardType from "./CardType";
import CardTypes from "./CardTypes";
import CookBook from "./CookBook";
import Canvas from "geode/lib/graphics/Canvas";
import Transform from "geode/lib/math/Transform";
import Input from "geode/lib/Input";

export default class Melter extends GameObject {
    ingredients: CardType[]
    base: Card
    sprite?: Sprite

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

    drawProduct() {
        let { product } = this

        let t = performance.now()

        let angle = Math.sin( t / 400 ) * 0.1

        let fequency = 0.01

        let offset = vector(
            Math.sin( t / 7 * fequency ),
            Math.cos( t / 13 * fequency )
        ).multiply( 10 )

        Canvas.push()

        product.position = Vector.ZERO

        Canvas.transform( new Transform(
            this.center.addY( -150 ).add( offset ),
            angle,
            Vector.ONE,
            product.dimensions.half.addY( 20 )
        ) )

        Canvas.alpha( 0.8 )

        product.draw( { shadowColor: "cornflowerblue" } )
        Canvas.pop()
    }

    draw() {
        let { sprite, position } = this
        let { x, y } = position

        let { mouse } = Input

        if ( this.contains( mouse ) )
            this.drawProduct()

        if ( sprite ) {
            let margin = vector( 32, 45 )
            sprite.draw( x + margin.x, y + margin.y, true )
        }
    }
}