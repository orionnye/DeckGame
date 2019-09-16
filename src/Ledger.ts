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

export default class Ledger extends GameObject {
    history?: string
    sprite?: Sprite

    preview = 0

    layer = 50

    constructor( x: number, y: number ) {
        super( vector( x, y ), 100, 400 )
        this.sprite = new Sprite( getImage( "Ledger" ) )
            .setSource( { x: 0, y: 0, w: 100, h: 100 } )
            .setDimensions( vector( 250, 150 ) )
    }

    onRender( canvas: Canvas, scene: Scene ) {
        let { sprite } = this
        let mouse = scene.mousePosition

        let previewTarget = 0
        if ( this.contains( mouse ) )
            previewTarget = 1
        this.preview = GMath.lerp( this.preview, previewTarget, 0.1 )

        if ( sprite ) {
            let margin = vector( 32, 45 )
            sprite.draw( canvas, margin.x, margin.y, true )
        }
    }
}