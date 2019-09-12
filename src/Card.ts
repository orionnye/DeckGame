import { getImage } from "geode/lib/assets";
import Canvas from "geode/lib/graphics/Canvas";
import GameObject from "geode/lib/gameobject/GameObject";
import Input from "geode/lib/Input";
import Sprite from "geode/lib/graphics/Sprite";
import Vector, { vector } from "geode/lib/math/Vector";
import animateSprite from "./animateSprite";
import CardType from "./CardType";
import Deck from "./Deck";
import Game from "./Game";
import Pawn from "./Pawn";
import Scene from "geode/lib/gameobject/Scene";
import Color from "geode/lib/graphics/Color";
import Melter from "./Melter";

export default class Card extends GameObject {

    type: CardType
    sprite?: Sprite
    inHand: boolean = false
    isPreview: boolean = false
    grabOffset: Vector = Vector.ZERO

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
                    if ( player.sprite )
                        animateSprite( player.sprite, 80, 9 )
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
}