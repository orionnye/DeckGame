import CardType from "./CardType";

const CardTypes = {
    //Offensive
    Attack1: new CardType( { imageName: "Attack", damage: 1 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 2 } ),
    Attack3: new CardType( { damage: 4 } ),
    Molotov: new CardType( {
        damage: 3,
        onApply: pawn => {
            pawn.heal -= 2
    }} ),
    Nuke: new CardType( { damage: 20 } ),
    Poison: new CardType( {
        imageName: "Poison",
        damage: -1,
        onApply: pawn => {
            pawn.heal -= 1
    }} ),
    Blood: new CardType( {
        damage: -1,
        onApply: pawn => {
            pawn.damage += 1
    } }),
    //Defensive
    Heal1: new CardType( { imageName: "Heal", damage: -1 } ),
    Heal2: new CardType( { imageName: "Heal", damage: -2 } ),
    Karma: new CardType( {
        imageName: "Karma",
        damage: 1,
        onApply: pawn => {
            pawn.heal += 1
    }} ),
    Dread: new CardType( {
        imageName: "Dread",
        onApply: pawn => {
            pawn.damage -= 1
    }} ),
    Volatile: new CardType( {
        imageName: "Volatile",
        damage: 0,
        onApply: pawn => {
            let potency = Math.floor(Math.random() * 5)
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