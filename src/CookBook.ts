import CardType from "./CardType";
import CardTypes from "./CardTypes";

class CookBook {
    static recipes: { [ name: string ]: CardType } = {}

    static getKey( ingredients: CardType[] ) {
        return ingredients.map( c => c.name ).sort().join( "-" )
    }

    static addRecipe( product: CardType, ingredients: CardType[] ) {
        let key = CookBook.getKey( ingredients )
        //change product to an arrray here

        CookBook.recipes[ key ] = product
    }

    static getProduct( ingredients: CardType[] ) {
        let key = CookBook.getKey( ingredients )
        return CookBook.recipes[ key ] || CardTypes.Volatile
    }
}

{
    let {
        Attack1, Attack2, Acid, Molotov,
        Poison, Heal1, Heal2, Karma,
        Volatile, Dread, Blood, Leeches,
        Infusion, Meds
    } = CardTypes
    let add = CookBook.addRecipe
    //Offensive
    add( Attack1, [ Volatile, Volatile ] )
    add( Attack2, [ Attack1, Attack1 ] )
    add( Acid, [ Attack1, Attack1, Attack1 ] )
    add( Acid, [ Attack1, Attack2 ] )
    add( Poison, [ Volatile, Heal1 ] )
    add( Molotov, [ Poison, Attack1 ] )
    add( Blood, [ Dread, Attack1 ] )
    add( CardTypes.Pact, [ Blood, Karma ] )
    add( Leeches, [ Attack1, Heal1 ] )
    //Defensive
    add( Heal1, [ Volatile ] )
    add( Heal2, [ Heal1, Heal1 ] )
    add( Karma, [ Heal1, Heal1, Heal1 ] )
    add( Dread, [ Attack1, Volatile ] )
    add( Infusion, [ Blood, Heal1 ] )
    //MISC
    add( Meds, [ Volatile, Heal2 ] )
}

export default CookBook