import GameObject from "geode/lib/gameobject/GameObject";
import Canvas from "geode/lib/graphics/Canvas";
import { rgb } from "geode/lib/graphics/Color";
import { getImage } from "geode/lib/assets";
import Game from "./Game";

export default class Background extends GameObject {
    layer = -100
    onRender( canvas: Canvas ) {
        let { enemyCount } = Game.instance

        let backgroundY = 150
        canvas.rect( 0, backgroundY, canvas.dimensions.x, canvas.dimensions.y )
            .fillStyle( rgb( 100, 100, 100 ) )
            .fill()
        canvas.image( getImage( "Ground" ), 0, backgroundY - 5, this.dimensions.x, 200 )
        canvas.image( getImage( "BackGroundMid" ), 0, 0, canvas.dimensions.x, backgroundY )

        //Level Count
        canvas.fillStyle( rgb( 255, 255, 255 ) )
            .text( "Level " + enemyCount, canvas.dimensions.x / 2 - 45, 30, 100, "40px pixel" )
    }
}