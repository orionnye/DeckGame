import Vector from "./common/Vector";
import Card from "./Card";
import Canvas from "./common/Canvas";
import GameObject from "./GameObject";

export default class Deck extends GameObject {
    offset: Vector
    cards: Card[]

    constructor( count, x, y, offsetX, offsetY ) {
        super( new Vector( x, y ), 0, 0 )
        this.offset = new Vector( offsetX, offsetY )
        let cards: Card[] = []
        for ( let i = 0; i < count; i++ ) {
            let deckPos = new Vector( x + offsetX * i, y + offsetY * i )
            // let rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
            let rainbow = [ "red", "red", "blue", "blue", "blue", "red", "red" ]
            let randColor = rainbow[ Math.floor( Math.random() * rainbow.length ) ]
            let card = new Card( deckPos, randColor )
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
        if ( this.length > 0 ) {
            this.cards.forEach( card => {
                //  lock in card positions
                let index = this.cards.indexOf( card )
                // x + this.offsetX * i
                let fixedX = this.position.x + index * this.offset.x
                let fixedY = this.position.y + index * this.offset.y
                let fixedPos = new Vector( fixedX, fixedY )
                if ( fixedPos.subtract( card.position ).length > 1 ) {
                    let fixVector = fixedPos.subtract( card.position )
                    card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 20 ) )
                }
            } )
        }
    }

    cardPosition( card: Card ) {
        let index = this.cards.indexOf( card )
        let x = this.position.x + index * this.offset.x
        let y = this.position.y + index * this.offset.y
        return new Vector( x, y )
    }

    draw( stack: boolean = true ) {
        for ( let card of this.cards ) {
            if ( stack )
                card.draw()
            else
                card.draw( card.color )
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