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
        let { position } = this

        //  lock in positions
        let fixedPos = hand.cardPosition( this )
        if ( !this.grabbed && fixedPos.subtract( position ).length > 5 ) {
            let fixVector = fixedPos.subtract( position )
            this.position = position.add( fixVector.unit.multiply( fixVector.length / 10 ) )
        }

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
        if ( color == "red" )
            Canvas.image( getImage( "CardATK1" ), this.position.x, this.position.y, this.width, this.height )
        else if ( color == "redred" )
            Canvas.image( getImage( "CardATK2" ), this.position.x, this.position.y, this.width, this.height )
        else if ( color == "blue" )
            Canvas.image( getImage( "CardHP1" ), this.position.x, this.position.y, this.width, this.height )
        else if ( color == "blueblue" )
            Canvas.image( getImage( "CardKarma" ), this.position.x, this.position.y, this.width, this.height )
        else
            Canvas.image( getImage( "CardVolatile" ), this.position.x, this.position.y, this.width, this.height )
    }
}