import EnemyType from "./MoveType";
import Pawn from "./Pawn";

const MoveTypes = {
    //Tier1 moves
    Cower: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 1
            dealer.health -= 3
        }
    } ),
    PuppyEyes: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.health += 2
            dealer.heal += 2
        }
    } ),
    WeakAttack: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 8
        }
    } ),
    FireBreath: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 20 + dealer.damage
            dealer.damage += 3
        }
    } ),
    Smolder: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.heal -= 1
            dealer.heal += 3
        }
    } ),
    Bite: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 10 + dealer.damage
            dealer.health += 10
        }
    } ),
    DamageBuff: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.damage += 3
        }
    } ),
    HealBuff: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.heal += 10
        }
    } ),
    MaxHealthBuff: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            dealer.maxHealth += 3
        }
    } ),
    HeavyAttack: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 25 + dealer.damage
        }
    } ),
    SoulStare: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.maxHealth -= 10
            dealer.maxHealth += 10
            dealer.health += 5
        }
    } ),
    HealthSteal: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 10
            dealer.health += 10
        }
    } )
}

for ( let key in MoveTypes ) {
    let type = MoveTypes[ key ]
    type.name = key
}

export default MoveTypes