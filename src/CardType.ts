import Pawn from "./Pawn";
import { playAudio, audioInstance, playSound } from "geode/lib/audio";
import { getAudio, getAudioInstance } from "geode/lib/assets";

type ApplyFunction = ( pawn: Pawn ) => void
export default class CardType {

    name!: string
    imageName: string
    damage: number = 0
    onApply?: ApplyFunction

    constructor( { imageName = "Blank", damage = 0, onApply = pawn => { } } ) {
        this.imageName = imageName
        this.damage = damage
        this.onApply = onApply
    }

    apply( pawn: Pawn ) {
        if ( this.onApply != null )
            this.onApply( pawn )
        if ( !pawn.main )
            setTimeout( () => playSound( "glassbreak", "wav", { volume: 1 / 6 } ), 600 )
        pawn.dealDamage( this.damage )
    }

    get image() {
        return "Card" + ( this.imageName || this.name )
    }

}