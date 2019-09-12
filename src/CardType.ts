import Pawn from "./Pawn";
import { playSound } from "geode/lib/audio";
import { getImage } from "geode/lib/assets";
import Canvas from "geode/lib/graphics/Canvas";
import Vector from "geode/lib/math/Vector";
import Card from "./Card";

type ApplyFunction = ( receiver: Pawn, dealer?: Pawn ) => void
export default class CardType {

    name!: string
    imageName: string
    damage: number = 0
    onApply?: ApplyFunction

    constructor( { imageName = "", damage = 0, onApply = receiver => { } } ) {
        this.imageName = imageName
        this.damage = damage
        this.onApply = onApply
    }

    apply( receiver: Pawn, dealer?: Pawn ) {
        receiver.health -= this.damage
        if ( this.onApply != null )
            this.onApply( receiver, dealer )
        if ( !receiver.main )
            setTimeout( () => playSound( "glassbreak.wav", { volume: 1 / 9 } ), 600 )
    }

    get imagePath() {
        return "cards/" + ( this.imageName || this.name )
    }

    private generatedImage?: CanvasImageSource
    get image() {
        if ( this.generatedImage )
            return this.generatedImage

        let blank = getImage( "cards/Blank" )
        let icon = getImage( this.imagePath )

        if ( !blank.complete || !icon.complete )
            return blank

        let innerCanvas = new OffscreenCanvas( 0, 0 )
        let canvas = new Canvas( innerCanvas )
        canvas.resize( Card.dimensions.x, Card.dimensions.y, 2 )
        canvas.smooth( false )

        canvas.vimage( blank, Vector.ZERO )

        canvas.image(
            icon,
            Card.dimensions.x / 2 - icon.width / 2,
            Card.upperSectionHeight / 2 - icon.height / 2
        )

        let margin = Math.round( Card.dimensions.x / 12 )
        canvas.fillStyle( "#D2B9A6" ).text( this.name.toUpperCase(), margin, Card.dimensions.y - margin, Card.dimensions.x - margin * 2, "20px pixel" )

        this.generatedImage = innerCanvas.transferToImageBitmap()
        return this.generatedImage
    }

}