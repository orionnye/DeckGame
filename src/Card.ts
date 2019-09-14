import { getImage } from "geode/lib/assets";
import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Input from "geode/lib/Input";
import Vector, { vector } from "geode/lib/math/Vector";
import CardType from "./CardType";
import Deck from "./Deck";
import Game from "./Game";
import Pawn from "./Pawn";
import Scene from "geode/lib/gameobject/Scene";
import Melter from "./Melter";
import { playSound } from "geode/lib/audio";

export default class Card extends GameObject {

    type: CardType
    grabOffset: Vector = Vector.ZERO

    deck?: Deck
    dealDelay = 0
    get inHand() { return this.deck && this.deck.isHand }
    get isPreview() { return !this.deck }

    static dimensions = vector( 68, 108 )
    static upperSectionHeight = 80

    constructor( position: Vector, type: CardType ) {
        super( position, Card.dimensions.x, Card.dimensions.y )
        this.position = position.copy
        this.type = type
    }

    get grabbed() {
        return Game.instance.grabbing == this
    }

    apply( receiver: Pawn, hand: Deck, discard: Deck, dealer?: Pawn ) {
        this.type.apply( receiver, dealer )
        hand.remove( this )
        let random = ( discard.length == 0 ) ? 0 : Math.floor( Math.random() * discard.length )
        discard.insertAt( this, random )
    }

    onUpdate( scene: Scene ) {
        let { deck } = this
        if ( deck && this.dealDelay == 0 ) {
            let fixedPos = deck.cardPosition( this )
            if ( fixedPos.subtract( this.position ).length > 1 ) {
                let fixVector = fixedPos.subtract( this.position )
                this.position = this.position.add( fixVector.unit.multiply( fixVector.length / 10 ) )
            }
        }

        if ( this.dealDelay == 1 )
            playSound( Card.randomFlipSound(), { volume: 1 / 8 } )
        this.dealDelay = Math.max( 0, this.dealDelay - 1 )

        if ( !this.inHand )
            return

        let game = Game.instance
        let { buttons } = Input
        let mouse = scene.mousePosition

        if ( buttons.Mouse0 ) {
            if ( this.contains( mouse ) && !game.grabbing ) {
                game.grabbing = this
                this.grabOffset = this.position.subtract( mouse )
            }
        } else {
            if ( this.grabbed )
                this.onDrop( scene )
        }

        if ( this.grabbed )
            this.position = mouse.add( this.grabOffset )
    }

    onDrop( scene: Scene ) {
        let game = Game.instance
        game.grabbing = undefined
        let { hand, discard, pawns, player, enemy } = Game.instance
        for ( let pawn of pawns ) {
            if ( pawn.overlaps( this ) ) {
                if ( pawn == player )
                    this.apply( player, hand, discard, enemy )
                else if ( pawn !== player ) {
                    this.apply( pawn, hand, discard, player )
                    if ( player.animator )
                        player.animator.play( 1000 )
                }
            }
        }

        let melters = scene.objectsInBox( this, x => x instanceof Melter ) as Melter[]
        let melter = melters[ 0 ]
        if ( melter ) {
            melter.melt( this )
            hand.remove( this )
        }
    }

    onRender( canvas: Canvas ) {
        let { type, inHand, isPreview } = this
        let showFront = isPreview || inHand
        if ( showFront ) {
            canvas.scale( 1 / 2, 1 / 2 )
            canvas.vimage( type.image, Vector.ZERO )
        } else {
            canvas.vimage( getImage( "cards/Blank" ), Vector.ZERO )
        }
    }

    static randomFlipSound() {
        return "cardflip_" + Math.floor( Math.random() * 4 ) + ".wav"
    }
}