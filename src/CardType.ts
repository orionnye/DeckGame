import Pawn from "./Pawn";
import { playSound } from "geode/lib/audio";
import Player from "./Game"

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

}