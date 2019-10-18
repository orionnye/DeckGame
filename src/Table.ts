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
    equipment: Melter[]
    sprite: Sprite

    layer = 50

    constructor( x: number, y: number , width: number, height: number) {
        super( vector( x, y ), width, height )
        this.equipment = []
        this.sprite = new Sprite( getImage( "Table" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( vector( width, height ) )
    }

    onRender( canvas: Canvas, scene: Scene ) {
        let { sprite } = this
        let mouse = scene.mousePosition

        let previewTarget = 0
        // if ( this.contains( mouse ) )

        // } )
        let margin = vector( 32, 45 )
        sprite.draw( canvas, margin.x, margin.y, true )
    }
}