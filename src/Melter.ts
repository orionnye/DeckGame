import { getImage } from "geode/lib/assets"
import GameObject from "geode/lib/gameobject/GameObject"
import Sprite from "geode/lib/graphics/Sprite"
import Vector, { vector } from "geode/lib/math/Vector"
import Card from "./Card"
import CardType from "./CardType"
import CardTypes from "./CardTypes"
import CookBook from "./CookBook"
import Canvas from "geode/lib/graphics/Canvas"
import Transform from "geode/lib/math/Transform"
import Input from "geode/lib/Input"
import Scene from "geode/lib/gameobject/Scene"
import Game from "./Game"
import GMath from "geode/lib/math/GMath"
import Color, { rgba } from "geode/lib/graphics/Color"
import { playSound } from "geode/lib/audio"

export default class Melter extends GameObject {
    ingredients: CardType[]
    base: Card
    sprite: Sprite
    multiplier: number

    preview = 0

    layer = 50

    constructor( x: number, y: number ) {
        super( vector( x, y ), 69, 100 )
        this.ingredients = []
        this.multiplier = 1
        this.base = new Card( this.position, CardTypes.Volatile )
        this.sprite = new Sprite( getImage( "Melter" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( vector( 110, 100 ) )
    }

    get products() {
        let type = CookBook.getProduct( this.ingredients )
        //Edit concotion to Equal an Array depending on Quantity
        let products: Card[] = []
        for ( let i = 0; i < this.multiplier * type.craftQuantity; i++ )
            products.push( new Card( this.base.position, type ) )
        return products
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
        canvas.push()
        canvas.alpha( this.preview * 0.8 )

        let t = performance.now()
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
        this.products.forEach( product => {
            this.drawProduct( canvas, scene, this.potentialProduct || product )
        } )
        let margin = vector( 32, 45 )
        sprite.draw( canvas, margin.x, margin.y, true )
    }
}