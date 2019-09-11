import GameObject from "geode/lib/gameobject/GameObject";
import Canvas from "geode/lib/graphics/Canvas";
import { rgb } from "geode/lib/graphics/Color";
import { getImage } from "geode/lib/assets";
import Game from "./Game";

export default class Background extends GameObject {
    layer = -100
    onRender() {
        let { enemyCount } = Game.instance

        let backgroundY = 150
        Canvas.rect( 0, backgroundY, Canvas.dimensions.x, Canvas.dimensions.y )
            .fillStyle( rgb( 100, 100, 100 ) )
            .fill()
        Canvas.image( getImage( "Ground" ), 0, backgroundY - 5, Canvas.canvas.clientWidth, 200 )
        Canvas.image( getImage( "BackGroundMid" ), 0, 0, Canvas.canvas.clientWidth, backgroundY )

        //Level Count
        Canvas.fillStyle( rgb( 255, 0, 0 ) )
            .text( "LEVEL" + enemyCount, Canvas.canvas.clientWidth / 2 - 45, 30, 100, "40px pixel" )
    }
}