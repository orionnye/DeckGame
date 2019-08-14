import Vector from "./Vector";
import Card from "./Card";

export default class Deck {
    position: Vector
    offsetX: number
    offsetY: number
    cards: Card[]

    constructor( count, x, y, offsetX, offsetY ) {
        let cards: Card[] = []
        this.offsetX = offsetX
        this.offsetY = offsetY
        for ( let i = 0; i < count; i++ ) {
            let deckPos = new Vector( x + this.offsetX * i, y + this.offsetY * i )
            // let rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
            let rainbow = [ "red", "red", "blue", "blue", "blue", "red", "red" ]
            let randColor = rainbow[ Math.floor( Math.random() * rainbow.length ) ]
            let card = new Card( deckPos, randColor )
            cards.push( card )
        }
        this.cards = cards
        this.position = new Vector( x, y )
    }

    get length() { return this.cards.length }

    remove( card ) {
        let index = this.cards.indexOf( card )
        let store = this.cards[ this.cards.length - 1 ]
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

    transferCard( destination: Deck ) {
        let card = this.cards.pop()
        if ( card )
            destination.cards.push( card )
    }

    updateToFixed() {
        if ( this.cards.length > 0 ) {
            this.cards.forEach( card => {
                //  lock in card positions
                let index = this.cards.indexOf( card )
                // x + this.offsetX * i
                let fixedX = this.position.x + index * this.offsetX
                let fixedY = this.position.y + index * this.offsetY
                let fixedPos = new Vector( fixedX, fixedY )
                if ( fixedPos.subtract( card.position ).length > 1 ) {
                    let fixVector = fixedPos.subtract( card.position )
                    card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 20 ) )
                }
            } )
        }
    }

}