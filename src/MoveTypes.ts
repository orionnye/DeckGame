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
            dealer.health -= 5
        }
    } )
}

for ( let key in MoveTypes ) {
    let type = MoveTypes[ key ]
    type.name = key
}

export default MoveTypes