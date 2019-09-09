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
import Scene from "geode/lib/gameobject/Scene";
import Game from "./Game";

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

    drawProduct( scene: Scene ) {
        let { product } = this
        product.isPreview = true

        let t = performance.now()
        let angle = Math.sin( t / 400 ) * 0.1
        let fequency = 0.002
        let offset = Vector.lissajous( t * fequency, 7, 13, 10 )

        Canvas.push()
        Canvas.transform( new Transform(
            this.dimensions.half.addY( -150 ).add( offset ),
            angle,
            Vector.ONE,
            product.dimensions.half.addY( 20 )
        ) )
        Canvas.alpha( 0.8 )
        product.onRender( scene )
        Canvas.pop()
    }

    onRender( scene: Scene ) {
        let { sprite } = this
        let mouse = scene.mousePosition

        if ( !Game.instance.grabbing && this.contains( mouse ) )
            this.drawProduct( scene )

        if ( sprite ) {
            let margin = vector( 32, 45 )
            sprite.draw( margin.x, margin.y, true )
        }
    }
}