import Pawn from "./Pawn";
import { playSound } from "geode/lib/audio";
import Player from "./Game"

type ApplyFunction = ( pawn: Pawn, player?: Pawn ) => void
export default class CardType {

    name!: string
    imageName: string
    damage: number = 0
    onApply?: ApplyFunction

    constructor( { imageName = "", damage = 0, onApply = pawn => { } } ) {
        this.imageName = imageName
        this.damage = damage
        this.onApply = onApply
    }

    apply( pawn: Pawn, player?: Pawn ) {
        pawn.health -= this.damage
        if ( this.onApply != null )
            this.onApply( pawn, player )
        if ( !pawn.main )
            setTimeout( () => playSound( "glassbreak.wav", { volume: 1 / 9 } ), 600 )
    }

    get imagePath() {
        return "cards/" + ( this.imageName || this.name )
    }

}