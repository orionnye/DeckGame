import CardType from "./CardType";
import CardTypes from "./CardTypes";

class CookBook {
    static recipes: { [ name: string ]: CardType } = {}
    static getKey( ingredients: CardType[] ) {
        return ingredients.map( c => c.name ).join( ", " )
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
CookBook.addRecipe( CardTypes.Attack1, [ CardTypes.Volatile, CardTypes.Volatile ] )
CookBook.addRecipe( CardTypes.Attack2, [ CardTypes.Attack1, CardTypes.Attack1 ] )
CookBook.addRecipe( CardTypes.Heal1, [ CardTypes.Volatile ] )
CookBook.addRecipe( CardTypes.Heal2, [ CardTypes.Heal1, CardTypes.Heal1 ] )
CookBook.addRecipe( CardTypes.Karma, [ CardTypes.Heal1, CardTypes.Attack1 ] )
CookBook.addRecipe( CardTypes.Poison, [ CardTypes.Heal1, CardTypes.Volatile ] )
CookBook.addRecipe( CardTypes.Nuke, [ CardTypes.Attack2, CardTypes.Attack2, CardTypes.Attack2 ] )

export default CookBook