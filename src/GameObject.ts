import Vector from "./common/Vector";
import Sprite from "./Sprite";
import { boxContains, boxOverlaps } from "./common/BoundingBoxUtils";
import Game from "./Game";
export default class GameObject {

    position: Vector = new Vector( 0, 0 )
    width: number = 0
    height: number = 0
    sprite: Sprite | null = null

    get dimensions() { return new Vector( this.width, this.height ) }

    constructor( position: Vector, width, height ) {
        this.position = position
        this.width = width
        this.height = height
    }

    contains( p: Vector ) { return boxContains( this, p ) }
    overlaps( other: GameObject ) { return boxOverlaps( this, other ) }
}