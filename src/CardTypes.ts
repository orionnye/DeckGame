import CardType from "./CardType";
import Pawn from "./Pawn";

const CardTypes = {
    //Offensive
    Attack1: new CardType( { imageName: "Attack", damage: 5 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 10 } ),
    Acid: new CardType( { damage: 15 } ),
    Molotov: new CardType( {
        damage: 5,
        onApply( receiver: Pawn ) {
            receiver.heal -= 3
        }
    } ),
    Poison: new CardType( {
        damage: -10,
        onApply( receiver: Pawn ) {
            receiver.heal -= 5
            // receiver.dizzyTime += 1000
        }
    } ),
    Blood: new CardType( {
        damage: 25,
        onApply( receiver: Pawn, dealer?: Pawn ) {
            if ( dealer )
                dealer.health -= 5
            receiver.damage += 3
        }
    } ),
    Pact: new CardType( {
        onApply( receiver: Pawn, dealer?: Pawn ) {
            if ( dealer ) {
                let damage = dealer.maxHealth - dealer.health
                receiver.health -= damage
                dealer.health += Math.floor( damage / 3 )
                dealer.maxHealth -= Math.floor( damage / 3 )
            }
        }
    } ),
    //Mix
    Leeches: new CardType( {
        onApply( receiver: Pawn, dealer?: Pawn ) {
            if ( dealer ) {
                dealer.health += 5
                receiver.health -= 5
            }
        }
    } ),
    Meds: new CardType( {
        onApply( receiver: Pawn ) {
            if ( receiver.heal < 0 )
                receiver.heal += 10
            else if ( receiver.heal >= 0 )
                receiver.heal -= 10
        }
    } ),
    //Defensive
    Heal1: new CardType( { imageName: "Heal", damage: -5 } ),
    Heal2: new CardType( { imageName: "Heal", damage: -10 } ),
    Infusion: new CardType( {
        onApply( receiver: Pawn ) {
            receiver.maxHealth -= 5
            receiver.health += 15
            receiver.heal += 3
        }
    } ),
    Karma: new CardType( {
        damage: 5,
        onApply( receiver: Pawn ) {
            receiver.maxHealth += 5
        }
    } ),
    Dread: new CardType( {
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            receiver.damage -= 3
            receiver.health -= damage
        }
    } ),
    Volatile: new CardType( {
        damage: 0,
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            receiver.health -= damage
        }
    } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes