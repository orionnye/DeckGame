import { overlaps, contains } from "./common";
import IBoundingBox from "./IBoundingBox";
import Vector from "./Vector";

const left = ( b: IBoundingBox ) => b.position.x
const right = ( b: IBoundingBox ) => b.position.x + b.width
const top = ( b: IBoundingBox ) => b.position.y
const bottom = ( b: IBoundingBox ) => b.position.y + b.height

export function boxContains( b: IBoundingBox, p: Vector ) {
    let xContains = contains( left( b ), right( b ), p.x )
    let yContains = contains( top( b ), bottom( b ), p.y )
    return xContains && yContains
}

export function boxOverlaps( b0: IBoundingBox, b1: IBoundingBox ) {
    let xOverlaps = overlaps(
        left( b0 ), right( b0 ),
        left( b1 ), right( b1 )
    )
    let yOverlaps = overlaps(
        top( b0 ), bottom( b0 ),
        top( b1 ), bottom( b1 )
    )
    return xOverlaps && yOverlaps
}