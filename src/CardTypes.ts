import CardType from "./CardType";

const CardTypes = {
    Attack1: new CardType( { damage: 1 } ),
    Attack2: new CardType( { damage: 3 } ),
    Heal1: new CardType( { damage: -1 } ),
    Heal2: new CardType( { imageName: "Heal1", damage: -3 } ),
    Volatile: new CardType( {
        damage: 0,
        onApply: pawn => {
            let potency = Math.floor(Math.random() * 5)
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            pawn.health -= damage
        }
    } ),
    Karma: new CardType( { imageName: "Karma", damage: -3 } ),
    Poison: new CardType( {
        imageName: "Poison",
        damage: -1,
        onApply: pawn => {
            pawn.heal -= 1
    }} ),
    Nuke: new CardType( { imageName: "Blank", damage: 20 } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes