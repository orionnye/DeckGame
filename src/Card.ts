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


export default class Card extends GameObject {

    type: CardType
    // grabbed: boolean
    sprite?: Sprite
    inHand: boolean = false
    isPreview: boolean = false

    static dimensions = vector( 69, 100 )

    constructor( position: Vector, type: CardType ) {
        super( position, Card.dimensions.x, Card.dimensions.y )
        this.position = position.copy
        this.type = type
        // this.grabbed = false
    }

    get grabbed() {
        return Game.instance.grabbing == this
    }

    apply( pawn: Pawn, hand: Deck, discard: Deck ) {
        this.type.apply( pawn )
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
            if ( this.contains( mouse ) && !game.grabbing )
                game.grabbing = this
        } else {
            if ( this.grabbed )
                this.onDrop()
        }

        if ( this.grabbed )
            this.position = mouse.subtract( this.dimensions.half )
    }

    onDrop() {
        let game = Game.instance
        game.grabbing = undefined
        let { hand, discard, pawns, melter, player } = Game.instance
        for ( let pawn of pawns ) {
            if ( pawn.overlaps( this ) ) {
                this.apply( pawn, hand, discard )
                if ( pawn !== player ) {
                    if ( player.sprite )
                        animateSprite( player.sprite, 80, 9 )
                }
            }
        }

        if ( melter.overlaps( this ) ) {
            console.log( "Melted ", this.type.name )
            melter.melt( this )
            hand.remove( this )
        }
    }

    onRender( scene: Scene ) {
        let { dimensions, width, height, type, inHand, isPreview } = this
        let margin = width / 12

        let showFront = isPreview || inHand

        let image = showFront ? type.image : "CardBlank"

        if ( isPreview )
            Canvas.shadow( 40, "cornflowerblue" )
        Canvas.vimage( getImage( image ), Vector.ZERO, dimensions )

        Canvas.shadow( 0, Color.transparent )
        if ( showFront )
            Canvas.fillStyle( "#D2B9A6" ).text( type.name.toUpperCase(), margin, height - margin, width - margin * 2, "20px pixel" );
    }
}