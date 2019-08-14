import Canvas from "./Canvas";
import Deck from "./Deck";
import Box from "./Box";
import Input from "./Input";
import Vector from "./Vector";
import { getImage } from "./common";
import Card from "./Card";

export default class Game {
    deck = new Deck( 8, 30, 350, -1, 1 )
    hand = new Deck( 5, 145, 300, 90, 0 )
    discard = new Deck( 0, 600, 350, 1, 1 )

    player = new Box( 100, 100, 100, 100, "red" )
    enemy = new Box( 500, 100, 100, 100, "blue" )

    handCap = 5

    grabbing = false

    constructor() {
        window.addEventListener( "keyup", e => this.keyup( e ) )
    }

    keyup( e: KeyboardEvent ) {
        let { deck, hand } = this
        if ( e.key == "Enter" )
            if ( hand.cards.length == 0 && deck.cards.length > 0 )
                this.endTurn()
    }

    endTurn() {
        let { enemy, player } = this

        if ( enemy.health > 0 ) {
            player.health -= 4
            enemy.health += 2
            enemy.offset.x = -60
            player.offset.x = -20
        }

        this.refillHand()
    }

    refillHand() {
        let { deck, hand, discard, handCap } = this

        if ( deck.cards.length < handCap ) {
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
        let { mouse, buttons: keys, buttons } = Input

        if ( player.offset.length > 1 )
            player.updateToFixed()

        enemy.updateToFixed()
        discard.updateToFixed()
        deck.updateToFixed()

        if ( hand.cards.length > 0 ) {
            for ( let card of hand.cards ) {
                //  lock in positions
                let index = hand.cards.indexOf( card )
                let fixedX = hand.position.x + index * hand.offsetX
                let fixedY = hand.position.y + index * hand.offsetY
                let fixedPos = new Vector( fixedX, fixedY )

                if ( !card.grabbed && fixedPos.subtract( card.position ).length > 5 ) {
                    let fixVector = fixedPos.subtract( card.position )
                    card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 20 ) )
                }

                if ( buttons.Mouse0 ) {
                    if ( card.contains( mouse ) && !this.grabbing ) {
                        this.grabbing = true
                        card.grabbed = true
                    }
                } else {
                    this.grabbing = false
                }

                if ( card.grabbed ) {
                    card.position.y = mouse.y - card.height / 2
                    card.position.x = mouse.x - card.width / 2
                    if ( player.collidesWith( card ) ) {
                        if ( card.color == "blue" ) {
                            player.offset.y = -30
                            hand.remove( card )
                            let random = ( discard.length == 0 ) ? 0 : Math.floor( Math.random() * discard.length )
                            discard.insertAt( card, random )
                            player.health += 1
                        }
                        card.grabbed = false
                    }

                    if ( enemy.collidesWith( card ) ) {
                        if ( card.color == "red" ) {
                            if ( enemy.health > 0 ) {
                                enemy.health -= 2
                                enemy.offset.x = 20
                            }
                            hand.remove( card )
                            discard.cards.push( card )
                        }
                        card.grabbed = false
                    }
                }
            }
        }

        if ( buttons.Mouse0 == false && hand.cards.length > 0 ) {
            hand.cards.forEach( card => {
                if ( card.grabbed )
                    card.grabbed = false
            } )
        }
    }

    render() {
        let { player, enemy, deck: playerDeck, hand: playerHand, discard: discardPile } = this

        // Canvas.fitWindow()
        Canvas.resize( 700, 500 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( "grey" )

        //  Player
        drawBox( player )

        //  Enemy
        let enemyPos = new Vector( enemy.position.x - enemy.width / 2 + enemy.offset.x, enemy.position.y + enemy.offset.y )
        Canvas.imageSource( 0, 0, 53, 35 )
            .partialImage(
                getImage( "chadwick" ),
                enemyPos.x, enemyPos.y,
                enemy.width * 2, enemy.height
            )

        drawHealthBar( enemy )

        //  Draw Deck
        drawDeck( playerDeck )
        if ( playerDeck.length >= 0 ) {
            let lastCard = playerDeck.cards[ playerDeck.cards.length - 1 ]
            let textX = lastCard.position.x
            let textY = lastCard.position.y + lastCard.height / 2
            Canvas.fillStyle( "black" )
                .text( playerDeck.cards.length.toString(), textX, textY, lastCard.width )
        }

        //  Draw Hand
        for ( let card of playerHand.cards ) {
            let index = playerHand.cards.indexOf( card )
            let fixedX = playerHand.position.x + index * playerHand.offsetX
            let fixedY = playerHand.position.y + index * playerHand.offsetY
            let fixedPos = new Vector( fixedX, fixedY )
            if ( !card.grabbed && fixedPos.subtract( card.position ).length > 5 ) {
                let fixVector = fixedPos.subtract( card.position )
                card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 20 ) )
            }
            drawCard( card, card.color )
        }

        //  Draw DiscardPile
        drawDeck( discardPile )
        if ( discardPile.length > 0 ) {
            let lastCard = discardPile.cards[ discardPile.cards.length - 1 ]
            let textX = discardPile.position.x
            let textY = discardPile.position.y + lastCard.height / 2
            Canvas.fillStyle( "black" )
                .text( discardPile.cards.length.toString(), textX, textY, lastCard.width )
        }
    }
}

function drawBox( box: Box ) {
    //  box
    Canvas.rect(
        box.position.x + box.offset.x, box.position.y + box.offset.y,
        box.width, box.height
    ).fillStyle( box.color ).fill()
    if ( box.health <= 0 ) {
        Canvas.text(
            "Dead",
            box.position.x + box.offset.x, box.position.y + box.offset.y + box.height / 2,
            box.width
        )
    }
    drawHealthBar( box )
}

function drawHealthBar( box: Box ) {
    let healthHeight = 20
    let healthWidth = box.health * 10
    let healthPos = new Vector( box.position.x, box.position.y + box.height + 5 )
    let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )
    Canvas.rect(
        healthPos.x, healthPos.y,
        healthWidth, healthHeight
    ).fillStyle( "red" ).fill().stroke()
    Canvas.fillStyle( "black" )
        .text(
            box.health.toString(),
            healthNumPos.x, healthNumPos.y,
            25, "25px timesNewRoman"
        )
}

function drawDeck( deck: Deck ) {
    //  Draw Deck
    if ( deck.cards.length > 0 ) {
        for ( let card of deck.cards )
            drawCard( card )
    }
}

function drawCard( card: Card, color = "white" ) {
    if ( color == "red" ) {
        Canvas.image( getImage( "attack" ), card.position.x, card.position.y, card.width, card.height )
    } else if ( color == "blue" ) {
        Canvas.image( getImage( "defend" ), card.position.x, card.position.y, card.width, card.height )
    } else {
        Canvas.fillStyle( color )
            .strokeStyle( "black" )
            .rect( card.position.x, card.position.y, card.width, card.height )
            .fill().stroke()
    }
}