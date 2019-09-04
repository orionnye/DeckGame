import CardType from "./CardType";
import CardTypes from "./CardTypes";

class CookBook {
    static recipes: { [ name: string ]: CardType } = {}

    static getKey( ingredients: CardType[] ) {
        return ingredients.map( c => c.name ).sort().join( "-" )
    }

    static addRecipe( product: CardType, ingredients: CardType[] ) {
        let key = CookBook.getKey( ingredients )
        CookBook.recipes[ key ] = product
    }

    static getProduct( ingredients: CardType[] ) {
        let key = CookBook.getKey( ingredients )
        return CookBook.recipes[ key ] || CardTypes.Volatile
    }
}

{
    let { Attack1, Attack2, Attack3, Molotov, Poison, Heal1, Heal2, Karma, Volatile, Dread } = CardTypes
    let add = CookBook.addRecipe
    //Offensive
    add( Attack1, [ Volatile, Volatile ] )
    add( Attack2, [ Attack1, Attack1 ] )
    add( Attack3, [ Attack1, Attack1, Attack1 ] )
    add( Poison, [ Volatile, Heal1 ] )
    add( Poison, [ Heal1, Volatile ] )
    add( Molotov, [ Poison, Attack1 ] )
    //Defensive
    add( Heal1, [ Volatile ] )
    add( Heal2, [ Heal1, Heal1 ] )
    add( Karma, [ Heal1, Heal1, Heal1 ] )
    add( Dread, [ Attack1, Volatile] )
    //MISC
    add( Volatile, [ Heal1, Attack1 ] )
}

export default CookBook