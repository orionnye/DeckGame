import CardType from "./CardType";


export default {
    red : new CardType("CardATK1", 1),
    redred : new CardType("CardATK2", 2),
    blue : new CardType("CardHP1", -1),
    blueblue : new CardType("CardHP1", -2),
    grey : new CardType("CardVolatile", 0, (pawn) => {
        //random Efect heal or damage
        let damage = (Math.random() > 0.5) ? 2 : -2
        pawn.health -= damage
    }),
}