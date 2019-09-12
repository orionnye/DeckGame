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

    static dimensions = vector( 67, 111 )

    constructor( position: Vector, type: CardType ) {
        super( position, Card.dimensions.x, Card.dimensions.y )
        this.position = position.copy
        this.type = type
    }

    get grabbed() {
        return Game.instance.grabbing == this
    }

    apply( pawn: Pawn, hand: Deck, discard: Deck, player?: Pawn ) {
        this.type.apply( pawn, player )
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
        let { hand, discard, pawns, player } = Game.instance
        for ( let pawn of pawns ) {
            if ( pawn.overlaps( this ) ) {
                this.apply( pawn, hand, discard, player )
                if ( pawn !== player ) {
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

    onRender( canvas: Canvas, scene: Scene ) {
        let { dimensions, width, height, type, inHand, isPreview } = this
        let margin = width / 12

        let showFront = isPreview || inHand

        let image = getImage( showFront ? type.imagePath : "cards/Blank" )
        if ( !image.width )
            image = getImage( "cards/Blank" )

        if ( isPreview )
            canvas.shadow( 40, "cornflowerblue" )
        canvas.vimage( image, Vector.ZERO, dimensions )

        canvas.shadow( 0, Color.transparent )
        if ( showFront )
            canvas.fillStyle( "#D2B9A6" ).text( type.name.toUpperCase(), margin, height - margin, width - margin * 2, "20px pixel" );
    }
}