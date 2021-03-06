import SpriteSheet from "geode/lib/graphics/SpriteSheet"
import { getImage } from "geode/lib/assets"
import { vector } from "geode/lib/math/Vector"
import Pawn from "./Pawn"
import Animator from "geode/lib/graphics/Animator"
import CardTypes from "./CardTypes"
import CardType from "./CardType"

class EnemyType {

    health: number
    strength: number = 100
    cardTypes: CardType[]
    spriteSheet: SpriteSheet

    constructor(
        health: number,
        strength: number,
        cardTypes: CardType[],
        spriteSheet: SpriteSheet
    ) {
        this.health = health
        this.strength = strength
        this.cardTypes = cardTypes
        this.spriteSheet = spriteSheet
    }

    create() {
        return new Pawn(
            vector( 520, 80 ), this.health,
            new Animator( this.spriteSheet ),
            this.cardTypes,
            this.strength 
        )
    }

}

let { 
    Attack1, Bite, Fortify, DamageBuff, HeavyAttack, MaxHealthBuff, 
    LifeSteal, Cower, Smolder, FireBreath, SoulStare, PuppyEyes, Karma,
    Blood, Pact, Roids, Poison, Meds, Molotov, Dread
    } = CardTypes
    
const enemyTypes = [
    new EnemyType(
        15, -3,
        [ Cower, Cower, Cower, Cower, Cower, Cower, Cower, Cower, Attack1 ],
        new SpriteSheet( {
            image: getImage( "Chadwick" ),
            frameWidth: 500,
            scale: 1 / 4
        } )
    ),

    new EnemyType(
        65, 10,
        [ Smolder, Smolder, Bite ],
        new SpriteSheet( {
            image: getImage( "Archlizard" ),
            center: vector( 48, 21 ),
            frameWidth: 100,
            scale: 2.4
        } )
    ),

    new EnemyType(
        45, 15, 
        [ Smolder, Bite, HeavyAttack ],
        new SpriteSheet( {
            image: getImage( "BoneDragon" ),
            center: vector( 30, 48 ),
            frameWidth: 84,
            scale: 1.4
        } )
    ),

    new EnemyType(
        40, 5,
        [ MaxHealthBuff, DamageBuff, DamageBuff, Blood, Attack1 ],
        new SpriteSheet( {
            image: getImage( "Noodle" ),
            frameWidth: 100,
            scale: 1.4
        } )
    ),

    new EnemyType(
        20, 0,
        [ SoulStare, SoulStare, SoulStare, SoulStare, SoulStare, Pact ],
        new SpriteSheet( {
            image: getImage( "EyeSlug" ),
            frameWidth: 100,
            scale: 0.25
        } )
    ),

    new EnemyType(
        50, 15,
        [ DamageBuff, DamageBuff, Attack1, Poison, Molotov ],
        new SpriteSheet( {
            image: getImage( "TribalTimmy" ),
            frameWidth: 100,
            scale: 1.5
        } )
    ),

    new EnemyType(
        60, 5,
        [ SoulStare, LifeSteal, LifeSteal, Blood, LifeSteal, LifeSteal, Karma ],
        new SpriteSheet( {
            image: getImage( "OcculentAustin" ),
            frameWidth: 100,
            scale: 2.3
        } )
    ),
    
    new EnemyType(
        35, 5,
        [ Fortify, DamageBuff, Attack1, Dread ],
        new SpriteSheet( {
            image: getImage( "MaskedMaggot" ),
            frameWidth: 100,
            scale: 1.5
        } )
    ),

    new EnemyType(
        45, 5,
        [ SoulStare, Fortify, DamageBuff ],
        new SpriteSheet( {
            image: getImage( "Headsman" ),
            frameWidth: 88,
            scale: 2.2
        } )
    ),

    new EnemyType(
        30, 5,
        [ Fortify, LifeSteal, LifeSteal, Dread, Poison, Poison ],
        new SpriteSheet( {
            image: getImage( "Pterry" ),
            frameWidth: 100,
            scale: 2.0
        } )
    ),

    new EnemyType(
        999, 20,
        [ SoulStare, Fortify, SoulStare ],
        new SpriteSheet( {
            image: getImage( "EyeDemon" ),
            frameWidth: 101,
            scale: 2.0
        } )
    ),
]

export function getEnemy( index: number ) {
    let enemyType = enemyTypes[ index ]
    let enemy = enemyType.create()
    return enemy
}

export function newEncounter( enemyCount: number ) {
    let enemyType = enemyTypes[ Math.floor( (enemyTypes.length - 1) * Math.random() ) ]
    let enemy = enemyType.create()
    enemy.damage += enemyCount
    return enemy
}