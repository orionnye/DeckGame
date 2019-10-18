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

export default class Ledger extends GameObject {
    sprite: Sprite

    layer = 60

    constructor( x: number, y: number ) {
        super( vector( x, y ), 100, 400 )
        this.sprite = new Sprite( getImage( "Ledger" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( vector( 100, 60 ) )
    }

    onRender( canvas: Canvas, scene: Scene ) {
        let { sprite } = this
        let mouse = scene.mousePosition
        
        let previewTarget = 0
        if ( this.contains( mouse ) ) {
            //check here for mouse click then display game details
            let text = `
            \nCombine Cards
            \nIn the Boiler
            \nTo craft new Cards`
            let textHeight = 55
            let textWidth = 35
            let font = textHeight.toString() + "px pixel"
            let lines = text.split("\n")
            for ( let i = 0; i < lines.length; i++) {
                canvas.fillStyle( "white" )
                canvas.text(lines[i], -450, (-lines.length + i) * textHeight, lines[i].length * textWidth, font)
                canvas.fillStyle( "blue" )
                canvas.text(lines[i], -445, (-lines.length + i) * textHeight + 5, lines[i].length * textWidth, font)
            }
        }

        let margin = vector( 32, 45 )
        sprite.draw( canvas, margin.x, margin.y, true )
        canvas.fillStyle( "rgba( 0, 0, 0, 0.9 )" )
        canvas.text("Manual", 2, 50, 60, "20px pixel")
    }
}