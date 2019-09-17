import Pawn from "./Pawn";


type ApplyFunction = ( receiver: Pawn, dealer: Pawn ) => void
export default class CardType {

    onApply?: ApplyFunction

    constructor( { onApply = (receiver, dealer) => { } } ) {
        this.onApply = onApply
    }

    apply( receiver: Pawn, dealer: Pawn ) {
        if ( this.onApply != null )
            this.onApply( receiver, dealer )
        receiver.health -= 5
        dealer.health += 5
    }
}