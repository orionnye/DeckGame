import Canvas from "geode/lib/graphics/Canvas"
import GameObject from "geode/lib/gameobject/GameObject"
import Vector, { vector } from "geode/lib/math/Vector"
import Scene from "geode/lib/gameobject/Scene"
import GMath from "geode/lib/math/GMath"
import Color from "geode/lib/graphics/Color"
import Animator from "geode/lib/graphics/Animator"
import Deck from "./Deck"
import Card from "./Card"
import CardTypes from "./CardTypes"

export default class Pawn extends GameObject {

    dizzyTime: number = 0
    dizziness: number = 0
    recentDamage = 0
    damageTime = 0
    private pHealth: number = 10
    maxHealth: number
    damage: number = 10
    heal: number
    main: boolean
    animator: Animator
    deck: Deck = new Deck(0, 0, 0, 0, 10,0, false)
    hand: Card = new Card(new Vector(0, 0), CardTypes.Heal1)

    layer = -50

    constructor( position, health, animator, startCards?, damage? ) {
        super( position, 100, 140 )
        this.maxHealth = health
        this.pHealth = health
        this.damage = damage
        this.heal = 2
        this.main = false
        this.animator = animator
        if ( startCards ) {
            this.hand = new Card(new Vector(0, 0), startCards[0])
            this.deck = new Deck(startCards.length, 0, this.position.x, this.position.y, 0, 0, false, startCards )
            startCards.forEach(CardType => {
                this.deck.insertAtRandom(new Card(this.position, CardType))
            })
        }
    }

    get randomCard() {
        let randomIndex = Math.floor(Math.random() * this.deck.length)
        console.log("deck:", this.deck)
        console.log("index:", randomIndex)
        let randomMove = this.deck.cards[randomIndex]
        console.log("Card:", randomMove.type)
        return randomMove
    }

    setNewHand() {
        this.hand = this.randomCard
    }

    get health() { return this.pHealth }
    set health( value: number ) {
        let increase = value - this.pHealth
        this.pHealth = GMath.clamp( value, 0, this.maxHealth )
        if ( increase < 0 )
            this.onDamage( -increase )
    }

    onDamage( amount: number ) {
        this.recentDamage += amount
        this.recentDamage = Math.min( this.maxHealth - this.health, this.recentDamage )
        this.damageTime += amount * 2
    }

    onUpdate() {
        this.recentDamage = Math.max( 0, this.recentDamage - 0.15 )
        this.damageTime = Math.max( 0, this.damageTime - 1 )
        this.dizzyTime = Math.max( 0, this.dizzyTime - 1 )
        if ( this.health > this.maxHealth )
            this.health = this.maxHealth
        if ( this.dizzyTime == 0 )
            this.dizziness = 0
    }

    statDecay() {
        //Where stat decrease over turns is applied
        if ( this.damage != 0 ) {
            this.damage -= Math.sign(this.damage)
        }
        if ( this.heal !== 0 )
            this.heal += Math.sign(this.heal) * -1
    }
    UseHand( target: Pawn, dealer: Pawn ) {
        if ( !this.main && this.health > 0 ) {
            this.hand.type.apply( target, dealer )
            this.setNewHand()
        }
    }

    onEndTurn() {
        if ( this.health > 0 ) {
            this.health += this.heal         
        }
        //Stat decay
        this.statDecay()
    }

    onRender( canvas: Canvas, scene: Scene ) {
        canvas.vtranslate(
            Vector.lissajous(
                this.damageTime * 10,
                7, 13, Math.sqrt( this.damageTime )
            )
        )

        // this.drawBasic( canvas )
        if ( this.animator ) {
            let { width, height } = this
            canvas.push().translate( width / 2, height / 2 )
            this.animator.onRender( canvas )
            canvas.pop()
        } else {
            this.drawBasic( canvas )
        }

        this.drawHealthBar( canvas )
        this.drawIntent( canvas )
    }

    drawBasic( canvas: Canvas ) {
        canvas.vrect(
            Vector.ZERO,
            this.dimensions
        ).fillStyle( Color.magenta ).fill()
    }

    drawHealthBar( canvas: Canvas ) {
        let healthHeight = 20
        let textWidth = 60
        let healthChunk = this.width / this.maxHealth
        let healthWidth = this.health * healthChunk
        let healthPos = vector( 0, this.height )
        let healthNumPos = healthPos.addXY( healthWidth / 3 - textWidth / 4, healthHeight - 2 )
        let damageWidth = this.recentDamage * healthChunk

        canvas.vrect( healthPos, vector( this.width, healthHeight ) ).fillStyle( Color.black ).fill()
        canvas.vrect( healthPos, vector( healthWidth, healthHeight ) ).fillStyle( Color.red ).fill()
        canvas.vrect( healthPos.addX( healthWidth ), vector( damageWidth, healthHeight ) ).fillStyle( Color.orange ).fill()

        canvas.fillStyle( "white" )
            .text(
                this.health + "/" + this.maxHealth,
                healthNumPos.x, healthNumPos.y,
                textWidth, "20px pixel"
            )
    }

    drawIntent( canvas: Canvas ) {
        let edge = this.main ? - 100 : 100
        canvas.fillStyle( "red" )
            .text(
                "Str:" + this.damage,
                edge, 25,
                80, "25px pixel"
            )
        if ( this.health > 0 ) {
            canvas.fillStyle( "green" )
                .text(
                    "Res:" + this.heal,
                    edge, 45,
                    80, "25px pixel"
                )
        }
        if ( !this.main ) {
            canvas.fillStyle( "rgb(200, 0, 200)" )
                .text(
                    this.hand!.type.name,
                    0, -30,
                    100, "25px pixel"
                )
        }
    }
}