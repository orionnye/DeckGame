import CardType from "./CardType";
import Pawn from "./Pawn";

const CardTypes = {
    //Offensive
    Attack1: new CardType( { imageName: "Attack", damage: 5 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 10 } ),
    Acid: new CardType( { imageName: "Acid2", damage: 15 } ),
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
        onApply( receiver: Pawn, dealer: Pawn ) {
            if ( dealer )
                dealer.health -= 5
            receiver.damage += 3
        }
    } ),
    Pact: new CardType( {
        imageName: "Pact3",
        onApply( receiver: Pawn, dealer: Pawn ) {
            if ( dealer ) {
                let damage = dealer.maxHealth - dealer.health
                receiver.health -= damage
                dealer.health += Math.floor( damage / 3 )
                dealer.maxHealth -= Math.floor( damage / 3 )
            }
        }
    } ),
    Dissect: new CardType( {
        onApply( receiver: Pawn, dealer: Pawn ) {
            let damage = 5
            if ( dealer && receiver.health <= damage ) {
                dealer.maxHealth += 10
                dealer.health = dealer.maxHealth
                dealer.heal -= 10
            }
            receiver.health -= damage
        }
    } ),
    //Mix
    Leeches: new CardType( {
        imageName: "Leeches",
        craftQuanity: 2,
        onApply( receiver: Pawn, dealer: Pawn ) {
                dealer.health += 5
                receiver.health -= 5
        }
    } ),
    Meds: new CardType( {
        imageName: "Meds",
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
        imageName: "Infusion",
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
    } ),
    // Enemy Moves
    // Tier1 Moves
    Cower: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 1
            dealer.health -= 3
        }
    } ),
    PuppyEyes: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 2
            dealer.heal += 2
        }
    } ),
    WeakAttack: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 8
        }
    } ),
    FireBreath: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 20 + dealer.damage
            dealer.damage += 3
        }
    } ),
    Smolder: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.heal -= 1
            dealer.heal += 3
        }
    } ),
    Bite: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 10 + dealer.damage
            dealer.health += 10
        }
    } ),
    DamageBuff: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.damage += 3
        }
    } ),
    HealBuff: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.heal += 10
        }
    } ),
    MaxHealthBuff: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.maxHealth += 3
        }
    } ),
    HeavyAttack: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 25 + dealer.damage
        }
    } ),
    SoulStare: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.maxHealth -= 10
            dealer.maxHealth += 10
            dealer.health += 5
        }
    } ),
    HealthSteal: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 10
            dealer.health += 10
        }
    } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes