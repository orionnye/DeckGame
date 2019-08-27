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

    type: CardType
    grabbed: boolean

    constructor( position: Vector, type: CardType ) {
        super( position, 69, 100 )
        this.position = position.copy
        this.type = type
        this.grabbed = false
    }

    apply( pawn: Pawn, hand: Deck, discard: Deck ) {

        this.type.apply( pawn )
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
            console.log( "Melted ", this.type.name )
            melter.melt( this )
            hand.remove( this )
        }
    }

    draw() {
        let { position, dimensions, width, height } = this
        let { x, y } = position
        let margin = width / 12

        Canvas.vimage( getImage( this.type.image ), position, dimensions )
        //Text IDEALLY would print the card description contained on the card
        Canvas.text( this.type.name, x + margin, y + height - margin, width - margin * 2, "20px pixel" );
    }
}