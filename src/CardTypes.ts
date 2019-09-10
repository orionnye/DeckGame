import CardType from "./CardType";
import Pawn from "./Pawn";

const CardTypes = {
    //Offensive
    Attack1: new CardType( { imageName: "Attack", damage: 5 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 10 } ),
    Acid: new CardType( { damage: 15 } ),
    Molotov: new CardType( {
        damage: 5,
        onApply( pawn: Pawn ) {
            pawn.heal -= 3
        }
    } ),
    Poison: new CardType( {
        imageName: "Poison",
        damage: -8,
        onApply( pawn: Pawn ) {
            pawn.heal -= 2
        }
    } ),
    Blood: new CardType( {
        imageName: "Blood",
        damage: 25,
        onApply( pawn: Pawn ) {
            pawn.damage += 3
        }
    } ),
    //Defensive
    Heal1: new CardType( { imageName: "Heal", damage: -5 } ),
    Heal2: new CardType( { imageName: "Heal", damage: -10 } ),
    Karma: new CardType( {
        imageName: "Karma",
        damage: 5,
        onApply( pawn: Pawn ) {
            pawn.maxHealth += 5
        }
    } ),
    Dread: new CardType( {
        imageName: "Dread",
        onApply( pawn: Pawn ) {
            let potency = Math.floor( Math.random() * 5 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            pawn.damage -= 3
            pawn.dealDamage( damage )
        }
    } ),
    Volatile: new CardType( {
        imageName: "Volatile",
        damage: 0,
        onApply( pawn: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            pawn.dealDamage( damage )
        }
    } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes