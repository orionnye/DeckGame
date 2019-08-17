import Vector from "./common/Vector";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Canvas from "./common/Canvas";
import { getImage } from "./common/common";
import Input from "./common/Input";
import Game from "./Game";
import GameObject from "./GameObject";

export default class Card extends GameObject {

    color: string
    grabbed: boolean

    constructor( position: Vector, color = "red" ) {
        super( position, 69, 100 )
        this.position = position
        this.color = color
        this.grabbed = false
    }

    apply( pawn: Pawn, hand: Deck, discard: Deck ) {
        let countOccurances = ( regex, str ) => [ ...str.matchAll( regex ) ].length
        let blueCount = countOccurances( /(blue)/g, this.color )
        let redCount = countOccurances( /(red)/g, this.color )

        pawn.offset.y = -30
        hand.remove( this )
        let random = ( discard.length == 0 ) ? 0 : Math.floor( Math.random() * discard.length )
        discard.insertAt( this, random )
        pawn.health += blueCount - redCount

        if ( this.color == "grey" ) {
            let heal = ( Math.random() > 0.5 ) ? true : false
            pawn.health += heal ? 2 : -2
        }
        this.grabbed = false
    }

    update( game: Game ) {
        let { mouse, buttons } = Input
        let { hand, discard, pawns, melter } = game

        if ( buttons.Mouse0 ) {
            if ( this.contains( mouse ) && !game.grabbing ) {
                game.grabbing = true
                this.grabbed = true
            }
        } else {
            game.grabbing = false
        }

        if ( this.grabbed ) {
            this.position = mouse.subtract( this.dimensions.half )
        } else {
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
    }

    draw( color = "white" ) {
        let { position, width, height } = this
        let { x, y } = position
        if ( color == "red" )
            Canvas.image( getImage( "CardATK1" ), x, y, width, height )
        else if ( color == "redred" )
            Canvas.image( getImage( "CardATK2" ), x, y, width, height )
        else if ( color == "blue" )
            Canvas.image( getImage( "CardHP1" ), x, y, width, height )
        else if ( color == "blueblue" )
            Canvas.image( getImage( "CardKarma" ), x, y, width, height )
        else
            Canvas.image( getImage( "CardVolatile" ), x, y, width, height )
    }
}