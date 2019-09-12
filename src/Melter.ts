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
import GMath from "geode/lib/math/GMath";
import Color, { rgba } from "geode/lib/graphics/Color";
import { playSound } from "geode/lib/audio";

export default class Melter extends GameObject {
    ingredients: CardType[]
    base: Card
    sprite?: Sprite

    preview = 0

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

    get potentialProduct() {
        let game = Game.instance
        if ( !game.grabbing ) return

        let ingredients = this.ingredients.slice()
        ingredients.push( game.grabbing.type )

        let type = CookBook.getProduct( ingredients )
        let concoction = new Card( this.base.position, type )
        return concoction
    }

    melt( card: Card ) {
        this.ingredients.push( card.type )
        playSound( "bubble.wav", { volume: 0.5 } )
    }

    drawProduct( canvas: Canvas, scene: Scene, product: Card ) {
        product.isPreview = true

        canvas.push()
        canvas.alpha( this.preview * 0.8 )

        let t = performance.now()
        // let center = this.dimensions.half 
        // let flicker = 0.2 * ( 1 + Math.sin( t / 200 ) + 0.5 )
        // canvas.fillStyle(
        //     canvas.gradient(
        //         Vector.ZERO, Vector.UP.multiply( 200 ),
        //         [
        //             [ 0, rgba( 109, 188, 201, flicker ) ],
        //             [ 1, rgba( 109, 188, 201, 0 ) ]
        //         ]
        //     ),
        // ).closedPath( [
        //     center.x - 30, center.y - 4,
        //     center.x - 100, center.y - 300,
        //     center.x + 100, center.y - 300,
        //     center.x + 30, center.y - 4,
        // ] ).fill()

        let angle = Math.sin( t / 400 ) * 0.1
        let fequency = 0.002
        let offset = Vector.lissajous( t * fequency, 7, 13, 10 )

        canvas.transform( new Transform(
            this.dimensions.half.addY( -150 ).add( offset ),
            angle,
            Vector.ONE,
            product.dimensions.half.addY( 20 )
        ) ).shadow( 40, Color.cornflowerblue )
        product.onRender( canvas )
        canvas.pop()
    }

    onRender( canvas: Canvas, scene: Scene ) {
        let { sprite } = this
        let mouse = scene.mousePosition

        let previewTarget = 0
        if ( this.contains( mouse ) )
            previewTarget = 1
        this.preview = GMath.lerp( this.preview, previewTarget, 0.1 )
        this.drawProduct( canvas, scene, this.potentialProduct || this.product )

        if ( sprite ) {
            let margin = vector( 32, 45 )
            sprite.draw( canvas, margin.x, margin.y, true )
        }
    }
}