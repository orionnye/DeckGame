import CardType from "./CardType";

const CardTypes = {
    //Offensive
    Attack1: new CardType( { imageName: "Attack", damage: 5 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 10 } ),
    Acid: new CardType( { damage: 15 } ),
    Molotov: new CardType( {
        damage: 5,
        onApply: pawn => {
            pawn.heal -= 2
    }} ),
    Poison: new CardType( {
        imageName: "Poison",
        damage: -8,
        onApply: pawn => {
            pawn.heal -= 1
    }} ),
    Blood: new CardType( {
        imageName: "Blood",
        damage: 10,
        onApply: pawn => {
            pawn.damage += 3
    } }),
    //Defensive
    Heal1: new CardType( { imageName: "Heal", damage: -5 } ),
    Heal2: new CardType( { imageName: "Heal", damage: -10 } ),
    Karma: new CardType( {
        imageName: "Karma",
        damage: 5,
        onApply: pawn => {
            pawn.maxHealth += 5
    }} ),
    Dread: new CardType( {
        imageName: "Dread",
        onApply: pawn => {
            pawn.damage -= 3
    }} ),
    Volatile: new CardType( {
        imageName: "Volatile",
        damage: 0,
        onApply: pawn => {
            let potency = Math.floor(Math.random() * 10)
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            pawn.health -= damage
        }
    } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes