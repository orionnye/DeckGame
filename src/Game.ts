import Canvas from "./common/Canvas";
import Deck from "./Deck";
import Pawn from "./Pawn";
import Input from "./common/Input";
import { getImage } from "./common/common";
import Card from "./Card";
import Melter from "./Melter";
import Sprite from "./Sprite";

export default class Game {
    deck = new Deck( 20, 30, 250, -1, 1 )
    hand = new Deck( 5, 145, 250, 90, 0 )
    discard = new Deck( 0, 600, 250, 1, 1 )

    player = new Pawn( 100, 50, 175, 175, "red" )
    enemy = new Pawn( 500, 50, 150, 150, "blue", 5 )

    melter = new Melter( 325, 375 )

    handCap = 5
    grabbing = false

    constructor() {
        window.addEventListener( "keyup", e => this.keyup( e ) )

        this.player.sprite = new Sprite( getImage( "PawnEgor" ) )
            .setSource( { x: 0, y: 0, w: 69, h: 69 } )
            .setDimensions( this.player.width, this.player.height )

        this.enemy.sprite = new Sprite( getImage( "PawnChadwick2" ) )
            .setSource( { x: 0, y: 0, w: 60, h: 64 } )
            .setDimensions( this.enemy.width * 0.8, this.enemy.height * 0.8 )
    }

    get pawns() {
        return [ this.player, this.enemy ]
    }

    keyup( e: KeyboardEvent ) {
        let { deck, hand } = this
        if ( e.key == "Enter" )
            if ( hand.length == 0 && deck.length > 0 )
                this.endTurn()
    }

    endTurn() {
        let { enemy, player, melter, deck } = this

        if ( enemy.health > 0 ) {
            player.health -= 2
            enemy.health += 2
            enemy.offset.x = -60
            player.offset.x = -20
        }

        this.refillHand()

        deck.cards.push( melter.product )
        // console.log( melter.product )
        melter.base = new Card( melter.position, "grey" )
        melter.colors = []
    }

    refillHand() {
        let { deck, hand, discard, handCap } = this

        if ( deck.length < handCap ) {
            for ( let card of deck.cards )
                hand.cards.push( card )
            deck.cards = discard.cards
            discard.cards = []
        }

        while ( hand.length < handCap )
            deck.transferCard( hand )
    }

    update() {
        this.render()

        let { deck, hand, discard, enemy, player } = this
        let { buttons } = Input

        if ( player.offset.length > 1 )
            player.updateToFixed()

        enemy.updateToFixed()

        hand.updateToFixed()
        discard.updateToFixed()
        deck.updateToFixed()

        for ( let card of hand.cards )
            card.update( this )

        if ( !buttons.Mouse0 && hand.length > 0 )
            for ( let card of hand.cards )
                card.grabbed = false

    }

    render() {
        let { deck, hand, discard } = this

        Canvas.resize( 700, 500 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( "rgb(30, 20, 20)")
        let backgroundY = 150
        Canvas.rect(0, backgroundY, Canvas.canvas.clientWidth, Canvas.canvas.clientHeight)
        Canvas.fillStyle("rgb(100, 100, 100")
        Canvas.fill()
        Canvas.image( getImage( "Ground" ), 0, backgroundY - 5, Canvas.canvas.clientWidth, 200 )
        Canvas.image( getImage( "BackGroundMid" ), 0, 0, Canvas.canvas.clientWidth, backgroundY )

        this.melter.draw()

        for ( let pawn of this.pawns )
            pawn.draw()

        deck.draw()
        discard.draw()
        hand.draw( false )
    }
}