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
        damage: -10,
        onApply( pawn: Pawn ) {
            pawn.heal -= 5
            // pawn.dizzyTime += 1000
        }
    } ),
    Blood: new CardType( {
        damage: 25,
        onApply( pawn: Pawn, player?: Pawn ) {
            if ( player )
                player.health -= 5
            pawn.damage += 3
        }
    } ),
    Pact: new CardType( {
        onApply( pawn: Pawn, player?: Pawn ) {
            if ( player ) {
                let damage = player.maxHealth - player.health
                pawn.health -= damage
                player.health += Math.floor( damage / 3 )
                player.maxHealth -= Math.floor( damage / 3 )
            }
        }
    } ),
    //Mix
    Leeches: new CardType( {
        damage: 5,
        onApply( pawn: Pawn, player?: Pawn ) {
            if ( player )
                player.health += 5
        }
    } ),
    Meds: new CardType( {
        onApply( pawn: Pawn ) {
            if ( pawn.heal < 0 )
                pawn.heal += 10
            else if ( pawn.heal >= 0 )
                pawn.heal -= 10
        }
    } ),
    //Defensive
    Heal1: new CardType( { imageName: "Heal", damage: -5 } ),
    Heal2: new CardType( { imageName: "Heal", damage: -10 } ),
    Infusion: new CardType( {
        onApply( pawn: Pawn ) {
            pawn.maxHealth -= 5
            pawn.health += 20
            pawn.heal += 3
        }
    } ),
    Karma: new CardType( {
        damage: 5,
        onApply( pawn: Pawn ) {
            pawn.maxHealth += 5
        }
    } ),
    Dread: new CardType( {
        onApply( pawn: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
            let damage = ( Math.random() > 0.5 ) ? potency : -potency
            pawn.damage -= 3
            pawn.heal -= damage
        }
    } ),
    Volatile: new CardType( {
        damage: 0,
        onApply( pawn: Pawn ) {
            let potency = Math.floor( Math.random() * 10 )
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