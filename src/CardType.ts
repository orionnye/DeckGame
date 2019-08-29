import Pawn from "./Pawn";

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
        if ( this.onApply != null ) {
            this.onApply( pawn )
        }
        pawn.health -= this.damage
    }

    get image() {
        return "Card" + ( this.imageName || this.name )
    }

}