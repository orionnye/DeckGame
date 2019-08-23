import Pawn from "./Pawn";

export default class CardType {

    image: string
    damage: number = 0
    custom?: (pawn: Pawn) => void

    constructor(image, damage = 0, custom?) {
        this.image = image
        this.damage = damage
        this.custom = custom
    }
    apply( pawn: Pawn ) {
        if (this.custom != null) {
            this.custom(pawn)
        }
        pawn.health -= this.damage
    }
    
}