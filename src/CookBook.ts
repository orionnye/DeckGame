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

CookBook.addRecipe( CardTypes.Attack2, [ CardTypes.Attack1, CardTypes.Attack1 ] )
CookBook.addRecipe( CardTypes.Heal2, [ CardTypes.Heal1, CardTypes.Heal1 ] )

export default CookBook