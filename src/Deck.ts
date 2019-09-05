import Vector, { vector } from "geode/lib/Vector";
import Card from "./Card";
import Canvas from "geode/lib/Canvas";
import GameObject from "geode/lib/GameObject";
import CardTypes from "./CardTypes";
import { getImage } from "geode/lib/assets";

export default class Deck extends GameObject {
    spread: Vector
    cards: Card[]

    constructor( count, x, y, spreadX, spreadY ) {
        super( vector( x, y ), 0, 0 )
        this.spread = vector( spreadX, spreadY )
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

    updateToFixed() {
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

    draw( stack: boolean = true ) {
        for ( let card of this.cards ) {
            if ( stack ) {
                let dimensions = new Vector( card.width, card.height )
                Canvas.vimage( getImage( "CardBlank" ), card.position, dimensions )
            }
            else
                card.draw()
        }
        if ( stack && this.length >= 0 ) {
            let lastCard = this.cards[ this.length - 1 ]
            if ( !lastCard )
                return
            let textX = lastCard.position.x
            let textY = lastCard.position.y + lastCard.height / 2
            Canvas.fillStyle( "black" )
                .text( this.length.toString(), textX, textY, lastCard.width )
        }
    }

}