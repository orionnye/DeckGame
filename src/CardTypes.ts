import CardType from "./CardType";

const CardTypes = {
    Attack1: new CardType( { damage: 1 } ),
    Attack2: new CardType( { damage: 2 } ),
    Heal1: new CardType( { damage: -1 } ),
    Heal2: new CardType( { imageName: "Heal1", damage: -2 } ),
    Volatile: new CardType( {
        damage: 0,
        onApply: pawn => {
            let damage = ( Math.random() > 0.5 ) ? 2 : -2
            pawn.health -= damage
        }
    } ),
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes