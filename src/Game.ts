import Canvas from "./Canvas";
import Deck from "./Deck";
import Box from "./Box";
import Input from "./Input";
import Vector from "./Vector";
import { getImage } from "./common";

export default class Game {
    playerDeck = new Deck( 8, 30, 350, -1, 1 )
    playerHand = new Deck( 5, 145, 300, 90, 0 )
    discardPile = new Deck( 0, 600, 350, 1, 1 )

    player = new Box( 100, 100, 100, 100, "red" )
    enemy = new Box( 500, 100, 100, 100, "blue" )

    handCap = 5

    grabbing = false

    constructor() {
        window.addEventListener( "keyup", e => this.keyup( e ) )
    }

    keyup( e: KeyboardEvent ) {
        let { playerDeck, playerHand, discardPile, enemy, player, handCap } = this
        if ( e.key == "Enter" && playerDeck.cards.length > 0 ) {
            if ( playerHand.cards.length == 0 ) {
                //  enemies turn
                if ( enemy.health > 0 ) {
                    player.health -= 4
                    enemy.health += 2
                    enemy.offSet.x = -60
                    player.offSet.x = -20
                }
                if ( playerDeck.cards.length < handCap ) {
                    playerDeck.cards.forEach( card => {
                        playerHand.cards.push( card )
                    } )
                    playerDeck.cards = discardPile.cards
                    discardPile.cards = []
                    while ( playerHand.length < 5 )
                        playerDeck.transferCard( playerHand )
                } else {
                    //  then swap discard into then take remaining hand
                    for ( let i = 0; i < handCap; i++ )
                        playerDeck.transferCard( playerHand )
                }
            }
        }
    }

    update() {
        this.render()

        let { playerDeck, playerHand, discardPile, enemy, player } = this
        let { mouse, buttons: keys, buttons } = Input

        if ( player.offSet.length > 1 )
            player.updateToFixed()

        enemy.updateToFixed()
        discardPile.updateToFixed()
        playerDeck.updateToFixed()

        if ( playerHand.cards.length > 0 ) {
            playerHand.cards.forEach( card => {

                //  lock in positions
                let index = playerHand.cards.indexOf( card )
                let fixedX = playerHand.position.x + index * playerHand.offsetX
                let fixedY = playerHand.position.y + index * playerHand.offsetY
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
                    let difference = card.position.subtract( mouse )
                    card.position.y = mouse.y - card.height / 2
                    card.position.x = mouse.x - card.width / 2
                    if ( player.collidesWith( card ) ) {
                        if ( card.color == "blue" ) {
                            player.offSet.y = -30
                            playerHand.remove( card )
                            let random = ( discardPile.length == 0 ) ? 0 : Math.floor( Math.random() * discardPile.length )
                            discardPile.insertAt( card, random )
                            player.health += 1
                        } else {

                        }
                        card.grabbed = false
                    }

                    if ( enemy.collidesWith( card ) ) {
                        if ( card.color == "red" ) {
                            if ( enemy.health > 0 ) {
                                enemy.health -= 2
                                // player.offSet.x = 60
                                enemy.offSet.x = 20
                            }
                            playerHand.remove( card )
                            discardPile.cards.push( card )
                        } else if ( card.color == "blue" ) {

                        } else {
                            // enemy.color = card.color
                        }
                        card.grabbed = false
                    }
                }
            } )
        }

        if ( buttons.Mouse0 == false && playerHand.cards.length > 0 ) {
            playerHand.cards.forEach( card => {
                if ( card.grabbed )
                    card.grabbed = false
            } )
        }
    }

    render() {
        let { player, enemy, playerDeck, playerHand, discardPile } = this

        // Canvas.fitWindow()
        Canvas.resize( 700, 500 )
        Canvas.context.imageSmoothingEnabled = false
        Canvas.background( "grey" )

        //  Player
        drawBox( player )

        //  Enemy
        let enemyPos = new Vector( enemy.position.x - enemy.width / 2 + enemy.offSet.x, enemy.position.y + enemy.offSet.y )
        Canvas.imageSource( 0, 0, 53, 35 )
            .partialImage(
                getImage( "holeyMan" ),
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
            Canvas.fillStyle( "black" ).text( playerDeck.cards.length.toString(), textX, textY, lastCard.width )
        }

        //  Draw Hand
        playerHand.cards.forEach( card => {
            let index = playerHand.cards.indexOf( card )
            let fixedX = playerHand.position.x + index * playerHand.offsetX
            let fixedY = playerHand.position.y + index * playerHand.offsetY
            let fixedPos = new Vector( fixedX, fixedY )
            if ( !card.grabbed && fixedPos.subtract( card.position ).length > 5 ) {
                let fixVector = fixedPos.subtract( card.position )
                card.position = card.position.add( fixVector.unit.multiply( fixVector.length / 20 ) )
            }
            drawCard( card, card.color )
        } )

        //  Draw DiscardPile
        drawDeck( discardPile )
        if ( discardPile.length > 0 ) {
            let lastCard = discardPile.cards[ discardPile.cards.length - 1 ]
            let textX = discardPile.position.x
            let textY = discardPile.position.y + lastCard.height / 2
            Canvas.fillStyle( "black" ).text( discardPile.cards.length.toString(), textX, textY, lastCard.width )
        }
    }
}

function drawBox( box ) {
    //  box
    Canvas.rect( box.position.x + box.offSet.x, box.position.y + box.offSet.y, box.width, box.height ).fillStyle( box.color ).fill()
    if ( box.health <= 0 )
        Canvas.text( "Dead", box.position.x + box.offSet.x, box.position.y + box.offSet.y + box.height / 2, box.width )
    drawHealthBar( box )
}

function drawHealthBar( box: Box ) {
    let healthHeight = 20
    let healthWidth = box.health * 10
    let healthPos = new Vector( box.position.x, box.position.y + box.height + 5 )
    let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )
    Canvas.rect( healthPos.x, healthPos.y, healthWidth, healthHeight ).fillStyle( "red" ).fill().stroke()
    Canvas.fillStyle( "black" ).text( box.health.toString(), healthNumPos.x, healthNumPos.y, 25, "25px timesNewRoman" )
}

function drawDeck( deck ) {
    //  Draw Deck
    if ( deck.cards.length > 0 ) {
        deck.cards.forEach( card => {
            drawCard( card )
        } )
    }
}

function drawCard( card, color = "white" ) {
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