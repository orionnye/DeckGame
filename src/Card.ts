import Vector from "./common/Vector";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Canvas from "./common/Canvas";
import { getImage } from "./common/common";
import Input from "./common/Input";
import Game from "./Game";
import GameObject from "./GameObject";
import CookBook from "./CookBook";
import CardType from "./CardType";

export default class Card extends GameObject {

    color: string
    grabbed: boolean

    constructor( position: Vector, color = "red" ) {
        super( position, 69, 100 )
        this.position = position.copy
        this.color = color
        this.grabbed = false
    }

    get cardType() {
        let type = CookBook[this.color] as CardType
        if (type == null) {
            throw new Error(`card not found: ${this.color}`)
        }
        return type
    }

    apply( pawn: Pawn, hand: Deck, discard: Deck ) {
        
        this.cardType.apply(pawn)
        this.grabbed = false
        
        pawn.offset.y = -30

        hand.remove( this )
        let random = ( discard.length == 0 ) ? 0 : Math.floor( Math.random() * discard.length )
        discard.insertAt( this, random )
    }

    update( game: Game ) {
        let { mouse, buttons } = Input

        if ( buttons.Mouse0 ) {
            if ( this.contains( mouse ) && !game.grabbing ) {
                game.grabbing = true
                this.grabbed = true
            }
        } else {
            if ( this.grabbed )
                this.onDrop( game )
            game.grabbing = false
            this.grabbed = false
        }

        if ( this.grabbed )
            this.position = mouse.subtract( this.dimensions.half )

    }

    onDrop( game: Game ) {
        let { hand, discard, pawns, melter } = game
        for ( let pawn of pawns )
            if ( pawn.overlaps( this ) )
                this.apply( pawn, hand, discard )

        if ( melter.overlaps( this ) ) {
            console.log( "MELTED in", this.color )
            melter.melt( this )
            hand.remove( this )
            this.color = "grey"
        }
    }

    draw( color = "white" ) {
        let { position, dimensions, width, height } = this
        let { x, y } = position
        let margin = width / 12

        Canvas.vimage( getImage( this.cardType.image ), position, dimensions )
        //Text IDEALLY would print the card description contained on the card
        Canvas.text( color, x + margin, y + height - margin, width - margin * 2, "20px pixel" );
    }
}