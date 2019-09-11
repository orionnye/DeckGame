import Vector, { vector } from "geode/lib/math/Vector";
import Card from "./Card";
import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import CardTypes from "./CardTypes";
import { getImage } from "geode/lib/assets";
import Scene from "geode/lib/gameobject/Scene";

export default class Deck extends GameObject {
    spread: Vector
    cards: Card[]
    isHand: boolean

    constructor( count, x, y, spreadX, spreadY, isHand: boolean ) {
        super( vector( x, y ), 0, 0 )
        this.spread = vector( spreadX, spreadY )
        this.isHand = isHand

        let cards: Card[] = []
        for ( let i = 0; i < count; i++ ) {
            let deckPos = vector( x + spreadX * i, y + spreadY * i )
            let types = [ CardTypes.Attack1, CardTypes.Heal1 ]
            // let types = [ CardTypes.Attack2 ]
            let type = types[ Math.floor( Math.random() * types.length ) ]
            let card = new Card( deckPos, type )
            cards.push( card )
        }
        this.cards = cards

        this.layer = 10
    }

    get length() { return this.cards.length }

    remove( card: Card ) {
        let index = this.cards.indexOf( card )
        let store = this.cards[ this.length - 1 ]
        this.cards[ index ] = store
        this.cards.pop()
    }

    insertAt( card, index ) {
        if ( this.length == 0 ) {
            this.cards.push( card )
            return
        }
        let store = this.cards[ index ]
        this.cards[ index ] = card
        this.cards.push( store )
    }

    insertAtRandom( card ) {
        let random = Math.floor( Math.random() * this.length )
        this.insertAt( card, random )
    }

    transferCard( destination: Deck ) {
        let card = this.cards.pop()
        if ( card )
            destination.cards.push( card )
    }

    onUpdate() {
        this.cards.forEach( card => {
            let fixedPos = this.cardPosition( card )
            if ( fixedPos.subtract( card.position ).length > 1 ) {
                let fixVector = fixedPos.subtract( card.position )
                card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 10 ) )
            }
        } )
    }

    cardPosition( card: Card ) {
        let index = this.cards.indexOf( card )
        return this.position.add(
            this.spread.multiply( index )
        )
    }

    onRender() {
        if ( !this.isHand && this.length >= 0 ) {
            let lastCard = this.cards[ this.length - 1 ]
            if ( !lastCard )
                return

            Canvas.vimage( getImage( "cards/Blank" ), Vector.ZERO, lastCard.dimensions )
            Canvas.fillStyle( "#a39081" )
                .text( this.length.toString(), 0, lastCard.height / 2, lastCard.width, "30px pixel" )
        }
    }

    onBuildScene( scene: Scene ) {
        let layer = 0
        for ( let card of this.cards ) {
            card.inHand = this.isHand
            card.layer = layer--
            if ( card.grabbed )
                card.layer = 100
            scene.add( card )
        }
    }

}