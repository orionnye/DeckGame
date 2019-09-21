import CardType from "./CardType"
import CardTypes from "./CardTypes"

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
    let add = CookBook.addRecipe
    let {
        Attack1, Attack2, Acid, Molotov,
        Poison, Heal1, Heal2, Karma,
        Volatile, Dread, Blood, Leeches,
        Infusion, Meds, Dissect, Pact, 
        Roids, Chaos, Bash, Charma, Smolder,
        FireBreath, Fortify, LifeSteal,
        Bite, SoulStare, Chaol
    } = CardTypes

    //Offensive
    add( Attack1, [ Volatile, Volatile ] )
    add( Attack2, [ Attack1, Attack1 ] )
    add( Bash, [ Attack2, Attack2 ] )
    add( Acid, [ Attack1, Attack1, Attack1 ] )
    add( Acid, [ Attack1, Attack2 ] )
    add( Poison, [ Volatile, Heal1 ] )
    add( Molotov, [ Poison, Attack1 ] )
    add( Blood, [ Leeches, Heal1 ] )
    add( Roids, [ Acid, Blood ] )
    add( Pact, [ Blood, Karma ] )
    add( Dissect, [ Leeches, Karma ] )
    add( FireBreath, [ Attack1, Attack1, Attack1, Attack1, Attack1 ] )

    //Defensive
    add( Heal1, [ Volatile ] )
    add( Heal2, [ Heal1, Heal1 ] )
    add( Karma, [ Heal1, Heal1, Heal1 ] )
    add( Dread, [ Attack1, Volatile ] )
    add( Infusion, [ Blood, Heal1 ] )
    add( Charma, [ Chaos, Karma ] )
    add( Smolder, [ Attack1, Attack1, Attack1, Attack1 ] )
    add( Fortify, [ Heal1, Heal1, Heal1, Heal1, Heal1 ] )
    add( Chaol, [ Heal2, Chaos ] )
    
    //MISC
    add( Chaos, [ Volatile, Volatile, Volatile ])
    add( Meds, [ Volatile, Heal2 ] )
    add( Leeches, [ Attack1, Heal1 ] )
    add( SoulStare, [ Chaos, Blood ] )
    add( LifeSteal, [ Attack2, Heal2 ] )
    add( Bite, [ Attack2, Heal1 ] )
}

export default CookBook