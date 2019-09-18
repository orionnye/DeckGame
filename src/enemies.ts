import SpriteSheet from "geode/lib/graphics/SpriteSheet";
import { getImage } from "geode/lib/assets";
import { vector } from "geode/lib/math/Vector";
import Pawn from "./Pawn";
import Animator from "geode/lib/graphics/Animator";
import MoveType from "./MoveType";
import MoveTypes from "./MoveTypes";

const enemySpriteSheets = [
    new SpriteSheet( {
        image: getImage( "Chadwick" ),
        frameWidth: 500,
        scale: 1 / 4
    } ),
    new SpriteSheet( {
        image: getImage( "Archlizard" ),
        center: vector( 48, 21 ),
        frameWidth: 100,
        scale: 2.4
    } ),
    new SpriteSheet( {
        image: getImage( "BoneDragon" ),
        center: vector( 30, 48 ),
        frameWidth: 84,
        scale: 1.4
    } ),
    new SpriteSheet( {
        image: getImage( "Noodle" ),
        frameWidth: 100,
        scale: 1.4
    } ),
    new SpriteSheet( {
        image: getImage( "EyeSlug" ),
        frameWidth: 100,
        scale: 0.25
    } ),
    new SpriteSheet( {
        image: getImage( "TribalTimmy" ),
        frameWidth: 100,
        scale: 1.5
    } ),
    new SpriteSheet( {
        image: getImage( "OcculentAustin" ),
        frameWidth: 100,
        scale: 2.3
    } ),
    new SpriteSheet( {
        image: getImage( "MaskedMaggot" ),
        frameWidth: 100,
        scale: 1.5
    } )
] as SpriteSheet[]
let { WeakAttack, Bite } = MoveTypes
const enemies: Pawn[] = [
    new Pawn(
        vector( 520, 80 ), 15,
        new Animator( enemySpriteSheets[ 0 ] ),
        [ MoveTypes.Cower, MoveTypes.PuppyEyes, WeakAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 25,
        new Animator( enemySpriteSheets[ 1 ] ),
        [ MoveTypes.FireBreath, MoveTypes.Smolder, Bite ]
    )
]


export function getEnemy( index: number ) {
    return new Pawn( vector( 520, 80 ), 15, new Animator( enemySpriteSheets[ index ] ), [MoveTypes.Cower] )
}

export function newEncounter( enemyCount: number ) {
    let newHealth = ( enemyCount + 1 ) * 10
    let enemy = getEnemy( Math.floor( enemySpriteSheets.length * Math.random() ) )
    enemy.heal = enemyCount * 2
    enemy.maxHealth = newHealth
    enemy.health = enemy.maxHealth
    enemy.damage = enemyCount * 4
    return enemy
}