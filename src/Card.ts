import { getImage } from "geode/lib/assets";
import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Input from "geode/lib/Input";
import Sprite from "geode/lib/graphics/Sprite";
import Vector from "geode/lib/math/Vector";
import animateSprite from "./animateSprite";
import CardType from "./CardType";
import Deck from "./Deck";
import Game from "./Game";
import Pawn from "./Pawn";


export default class Card extends GameObject {

    type: CardType
    grabbed: boolean
    sprite?: Sprite

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

        if ( mouse )
            mouse = game.globalTransform.pointToLocal( mouse )

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
        for ( let pawn of pawns ) {
            if ( pawn.overlaps( this ) ) {
                this.apply( pawn, hand, discard )
                if ( pawn !== game.player ) {
                    if ( game.player.sprite )
                        animateSprite( game.player.sprite, 80, 9 )
                }
            }
        }

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
        Canvas.fillStyle( "#D2B9A6" ).text( this.type.name.toUpperCase(), x + margin, y + height - margin, width - margin * 2, "20px pixel" );
    }
}