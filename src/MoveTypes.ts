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
            reciever.health -= 3
        }
    } ),
    FireBreath: new EnemyType( {
        onApply( reciever: Pawn, dealer: Pawn ) {
            reciever.health -= 20
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