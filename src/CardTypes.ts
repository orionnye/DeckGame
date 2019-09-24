import CardType from "./CardType"
import Pawn from "./Pawn"

const CardTypes = {
    //THEWINCARDS
    PlaneShift: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            let dealMax = dealer.maxHealth
            let dealHealth = dealer.health
            dealer.maxHealth = reciever.maxHealth
            dealer.health = reciever.health
            reciever.maxHealth = dealMax
            reciever.health = dealHealth
            console.log("You Win")
        }
    } ),
    //OFFENSIVE
    Attack1: new CardType( { imageName: "Attack", damage: 5 } ),
    Attack2: new CardType( { imageName: "Attack", damage: 10 } ),
    Bash: new CardType( { imageName: "Attack", damage: 20 } ),
    Acid: new CardType( { imageName: "Acid2", damage: 15 } ),
        //DAMAGE OVER TIME
    Molotov: new CardType( {
        damage: 5,
        onApply( receiver: Pawn ) {
            receiver.heal -= 3
        }
    } ),
    Poison: new CardType( {
        craftQuanity: 2,
        onApply( receiver: Pawn ) {
            receiver.health += 10,
            receiver.heal -= 5
            // receiver.dizzyTime += 1000
        }
    } ),
    Blood: new CardType( {
        onApply( receiver: Pawn, dealer: Pawn ) {
            receiver.health -= 20
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
    Roids: new CardType( {
        onApply( receiver: Pawn, dealer: Pawn) {
            receiver.damage += 10
            receiver.heal -= 15
        }
    } ),
    //Mix
    Leeches: new CardType( {
        imageName: "Leeches",
        craftQuanity: 2,
        damage: 5,
        onApply( receiver: Pawn, dealer: Pawn ) {
                dealer.health += 5
        }
    } ),
    Meds: new CardType( {
        imageName: "Meds",
        craftQuanity: 2,
        onApply( receiver: Pawn ) {
            if ( receiver.heal < 0 )
                receiver.heal += 10
            else if ( receiver.heal >= 0 )
                receiver.heal -= 10
        }
    } ),
    //Defensive
    Heal1: new CardType( {
        imageName: "Heal", 
        onApply( receiver: Pawn ) {
            receiver.health += 5
        }
    } ),
    Heal2: new CardType( {
        imageName: "Heal", 
        onApply( receiver: Pawn ) {
            receiver.health += 10
        }
    } ),
    Chaol: new CardType( {
        imageName: "Heal", 
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 50 )
            receiver.health += potency
        }
    } ),
    Infusion: new CardType( {
        imageName: "Infusion",
        onApply( receiver: Pawn ) {
            receiver.maxHealth -= 5
            receiver.health += 15
            receiver.heal += 3
        }
    } ),
    Karma: new CardType( {
        onApply( receiver: Pawn ) {
            receiver.health -= 5,
            receiver.maxHealth += 10
        }
    } ),
    Dread: new CardType( {
        craftQuanity: 2,
        onApply( receiver: Pawn ) {
            receiver.damage -= 4
        }
    } ),
    Volatile: new CardType( {
        damage: 0,
        craftQuanity: 2,
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            receiver.health -= damage
        }
    } ),
    Chaos: new CardType( {
        damage: 0,
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 40 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            receiver.health -= damage
        }
    } ),
    Charma: new CardType( {
        onApply( receiver: Pawn ) {
            let potency = Math.floor( Math.random() * 30 )
            receiver.maxHealth += potency
        }
    } ),
    // Enemy Moves
    Cower: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.damage += 10
            dealer.health -= 3
            dealer.heal += 3
        }
    } ),
    PuppyEyes: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 3
            dealer.heal += 10
        }
    } ),
    FireBreath: new CardType( {
        damage: 10,
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.damage += 3
            reciever.heal -= 3
        }
    } ),
    Smolder: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 10
            dealer.heal += 5
        }
    } ),
    Bite: new CardType( {
        damage: 15,
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 10
        }
    } ),
    DamageBuff: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.damage += 10
        }
    } ),
    Fortify: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.heal += 10
        }
    } ),
    MaxHealthBuff: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.maxHealth += 15
        }
    } ),
    HeavyAttack: new CardType( { damage: 25 } ),
    SoulStare: new CardType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.maxHealth -= 10
            dealer.maxHealth += 10
            dealer.health += 5
        }
    } ),
    LifeSteal: new CardType( {
        damage: 10,
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 10 + dealer.damage
        }
    } )
}

for ( let key in CardTypes ) {
    let type = CardTypes[ key ]
    type.name = key
}

export default CardTypes