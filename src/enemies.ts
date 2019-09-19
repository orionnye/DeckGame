import SpriteSheet from "geode/lib/graphics/SpriteSheet";
import { getImage } from "geode/lib/assets";
import { vector } from "geode/lib/math/Vector";
import Pawn from "./Pawn";
import Animator from "geode/lib/graphics/Animator";
import CardTypes from "./CardTypes";

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
let { WeakAttack, Bite, HealBuff, DamageBuff, HeavyAttack, MaxHealthBuff, HealthSteal } = CardTypes
const enemies: Pawn[] = [
    new Pawn(
        vector( 520, 80 ), 15,
        new Animator( enemySpriteSheets[ 0 ] ),
        [ CardTypes.Cower, CardTypes.PuppyEyes, WeakAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 35,
        new Animator( enemySpriteSheets[ 1 ] ),
        [ CardTypes.FireBreath, CardTypes.Smolder, Bite, HeavyAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 25,
        new Animator( enemySpriteSheets[ 2 ] ),
        [ CardTypes.Smolder, Bite, HeavyAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 21,
        new Animator( enemySpriteSheets[ 3 ] ),
        [ MaxHealthBuff, DamageBuff, DamageBuff, WeakAttack, WeakAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 5,
        new Animator( enemySpriteSheets[ 4 ] ),
        [ CardTypes.SoulStare, HealthSteal ]
    ),
    new Pawn(
        vector( 520, 80 ), 25,
        new Animator( enemySpriteSheets[ 5 ] ),
        [ CardTypes.SoulStare, DamageBuff, DamageBuff, WeakAttack ]
    ),
    new Pawn(
        vector( 520, 80 ), 50,
        new Animator( enemySpriteSheets[ 6 ] ),
        [ CardTypes.SoulStare, HealthSteal, HealthSteal, HealthSteal, HealthSteal, HealthSteal ]
    ),
    new Pawn(
        vector( 520, 80 ), 25,
        new Animator( enemySpriteSheets[ 7 ] ),
        [ HealBuff, DamageBuff, WeakAttack ]
    )
]


export function getEnemy( index: number ) {
    let enemy  = enemies[index]

    return enemy
}

export function newEncounter( enemyCount: number ) {
    let enemy = enemies[Math.floor( enemies.length * Math.random() )]
    enemy.health = enemy.maxHealth
    return enemy
}