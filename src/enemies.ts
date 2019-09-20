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
    WeakAttack, Bite, HealBuff, DamageBuff, HeavyAttack, MaxHealthBuff, 
    HealthSteal, Cower, Smolder, FireBreath, SoulStare, PuppyEyes, Karma
    } = CardTypes
    
const enemyTypes = [
    new EnemyType(
        15, -3,
        [ Cower, PuppyEyes, WeakAttack ],
        new SpriteSheet( {
            image: getImage( "Chadwick" ),
            frameWidth: 500,
            scale: 1 / 4
        } )
    ),

    new EnemyType(
        65, 10,
        [ Smolder, Smolder, Smolder, Bite, Smolder ],
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
        [ MaxHealthBuff, DamageBuff, DamageBuff, WeakAttack, WeakAttack ],
        new SpriteSheet( {
            image: getImage( "Noodle" ),
            frameWidth: 100,
            scale: 1.4
        } )
    ),

    new EnemyType(
        20, 0,
        [ SoulStare ],
        new SpriteSheet( {
            image: getImage( "EyeSlug" ),
            frameWidth: 100,
            scale: 0.25
        } )
    ),

    new EnemyType(
        50, 15,
        [ DamageBuff, DamageBuff, WeakAttack ],
        new SpriteSheet( {
            image: getImage( "TribalTimmy" ),
            frameWidth: 100,
            scale: 1.5
        } )
    ),

    new EnemyType(
        60, 5,
        [ SoulStare, HealthSteal, HealthSteal, HealthSteal, HealthSteal, HealthSteal, Karma ],
        new SpriteSheet( {
            image: getImage( "OcculentAustin" ),
            frameWidth: 100,
            scale: 2.3
        } )
    ),
    
    new EnemyType(
        35, 5,
        [ HealBuff, DamageBuff, WeakAttack ],
        new SpriteSheet( {
            image: getImage( "MaskedMaggot" ),
            frameWidth: 100,
            scale: 1.5
        } )
    ),

    new EnemyType(
        45, 5,
        [ SoulStare, HealBuff, DamageBuff ],
        new SpriteSheet( {
            image: getImage( "Headsman" ),
            frameWidth: 88,
            scale: 2.2
        } )
    ),

    new EnemyType(
        135, 20,
        [ SoulStare, HealBuff, SoulStare ],
        new SpriteSheet( {
            image: getImage( "EyeDemon" ),
            frameWidth: 101,
            scale: 2.0
        } )
    )
]

export function getEnemy( index: number ) {
    let enemyType = enemyTypes[ index ]
    let enemy = enemyType.create()
    return enemy
}

export function newEncounter( enemyCount: number ) {
    let enemyType = enemyTypes[ Math.floor( enemyTypes.length * Math.random() ) ]
    let enemy = enemyType.create()
    return enemy
}