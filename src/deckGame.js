function run() {
    let canvas = document.getElementById( "myCanvas" )
    let c = canvas.getContext( "2d" )

    //  Sprites
    let attack = new Image( 69, 100 )
    attack.src = "sprites/attack.png"
    document.body.appendChild( attack )

    let defend = new Image( 69, 100 )
    defend.src = "sprites/defend.png"
    document.body.appendChild( defend )

    let chadwick = new Image( 400, 100 )
    chadwick.src = "sprites/holeyMan.png"
    document.body.appendChild( chadwick )

    //  Global variables
    let playerDeck = new Deck( 8, 30, 350, -1, 1 )
    let handCap = 5
    let playerHand = new Deck( 5, 145, 300, 90, 0 )
    let discardPile = new Deck( 0, 600, 350, 1, 1 )
    let player = new Box( 100, 100, 100, 100, "red" )
    let enemy = new Box( 500, 100, 100, 100, "blue" )

    let mouse = new Vector( 0, 0 )
    let mouseKeys = new Map()
    let keys = new Map()

    //  Input Watch
    window.addEventListener( "keydown", ( e ) => {
        //  console.log(e.key)
        keys.set( e.key, true )
    } )
    window.addEventListener( "keyup", ( e ) => {
        //  console.log(e.key)
        keys.set( e.key, false )
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
                    let amount = 5 - playerHand.length
                    while ( playerHand.length < 5 )
                        playerHand.cards.push( playerDeck.cards.pop() )
                } else {
                    //  then swap discard into then take remaining hand
                    for ( let i = 0; i < handCap; i++ )
                        playerHand.cards.push( playerDeck.cards.pop() )
                }
            }
        }
    } )
    window.addEventListener( "mousemove", ( e ) => {
        //  console.log(mouse)
        mouse = new Vector( e.x, e.y )
    } )
    window.addEventListener( "mousedown", ( e ) => {
        //  console.log("clicked", e.button)
        mouseKeys.set( e.button, true )
    } )
    window.addEventListener( "mouseup", ( e ) => {
        //  console.log("clicked", e.button)
        mouseKeys.set( e.button, false )
    } )

    function update() {
        if ( player.offSet.length > 1 ) {
            player.updateToFixed()
        }
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
                    card.position = card.position.add( fixVector.normalize.multiply( fixVector.length / 20 ) )
                }
                if ( mouseKeys.get( 0 ) ) {
                    if ( card.contains( mouse ) && !mouseKeys.get( "grabbing" ) ) {
                        mouseKeys.set( "grabbing", true )
                        card.grabbed = true
                    }
                } else {
                    mouseKeys.set( "grabbing", false )
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
        if ( mouseKeys.get( 0 ) == false && playerHand.cards.length > 0 ) {
            playerHand.cards.forEach( card => {
                if ( card.grabbed ) {
                    card.grabbed = false
                }
            } )
        }
    }

    function render() {
        // setup
        c.imageSmoothingEnabled = false
        //  Define Canvas space
        drawRect( 0, 0, canvas.clientWidth, canvas.clientHeight, "grey" )

        //  Player
        drawBox( player )

        //  Enemy
        let enemyPos = new Vector( enemy.position.x - enemy.width / 2 + enemy.offSet.x, enemy.position.y + enemy.offSet.y )
        c.drawImage( chadwick, 0, 0, 53, 35, enemyPos.x, enemyPos.y, enemy.width * 2, enemy.height )
        //  Health Bar
        let healthHeight = 20
        let healthWidth = enemy.health * 10
        let healthPos = new Vector( enemy.position.x, enemy.position.y + enemy.height + 5 )
        drawRect( healthPos.x, healthPos.y, healthWidth, healthHeight, "red" )
        c.strokeRect( healthPos.x, healthPos.y, healthWidth, healthHeight )
        let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )
        drawText( enemy.health.toString(), healthNumPos.x, healthNumPos.y, 25, healthHeight, "black", "25px timesNewRoman" )
        // drawBox(enemy)

        //  Draw Deck
        drawDeck( playerDeck )
        if ( playerDeck.length >= 0 ) {
            let lastCard = playerDeck.cards[playerDeck.cards.length - 1]
            let textX = lastCard.position.x
            let textY = lastCard.position.y + lastCard.height / 2
            drawText( playerDeck.cards.length.toString(), textX, textY, lastCard.width, lastCard.height )
        }
        //  Draw Hand
        playerHand.cards.forEach( card => {
            let index = playerHand.cards.indexOf( card )
            let fixedX = playerHand.position.x + index * playerHand.offsetX
            let fixedY = playerHand.position.y + index * playerHand.offsetY
            let fixedPos = new Vector( fixedX, fixedY )
            if ( !card.grabbed && fixedPos.subtract( card.position ).length > 5 ) {
                let fixVector = fixedPos.subtract( card.position )
                card.position = card.position.add( fixVector.normalize.multiply( fixVector.length / 20 ) )
            }
            drawCard( card, card.color )
        } )
        //  Draw DiscardPile
        drawDeck( discardPile )
        if ( discardPile.length > 0 ) {
            let lastCard = discardPile.cards[discardPile.cards.length - 1]
            let textX = discardPile.position.x
            let textY = discardPile.position.y + lastCard.height / 2
            drawText( discardPile.cards.length.toString(), textX, textY, lastCard.width, lastCard.height )
        }
    }
    function drawBox( box ) {
        //  box
        drawRect( box.position.x + box.offSet.x, box.position.y + box.offSet.y, box.width, box.height, box.color )
        if ( box.health <= 0 ) {
            drawText( "Dead", box.position.x + box.offSet.x, box.position.y + box.offSet.y + box.height / 2, box.width, box.height )
        }
        //  health Bar
        let healthHeight = 20
        let healthWidth = box.health * 10
        let healthPos = new Vector( box.position.x, box.position.y + box.height + 5 )
        drawRect( healthPos.x, healthPos.y, healthWidth, healthHeight, "red" )
        c.strokeRect( healthPos.x, healthPos.y, healthWidth, healthHeight )
        let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )
        drawText( box.health.toString(), healthNumPos.x, healthNumPos.y, 25, healthHeight, "black", "25px timesNewRoman" )
    }
    function drawText( text, x, y, width, height, color = "black", font = "50px timesNewRoman" ) {
        //  text
        c.font = font
        c.fillStyle = "black"
        c.fillText( text, x, y, width, height )
    }
    function drawDeck( deck ) {
        //  Draw Deck
        if ( deck.cards.length > 0 ) {
            deck.cards.forEach( card => {
                drawCard( card )
            } )
        }
    }
    function drawHealth() {
        //  Health Bar
        let healthHeight = 20
        let healthWidth = enemy.health * 10
        let healthPos = new Vector( enemy.position.x, enemy.position.y + enemy.height + 5 )
        drawRect( healthPos.x, healthPos.y, healthWidth, healthHeight, "red" )
        c.strokeRect( healthPos.x, healthPos.y, healthWidth, healthHeight )
        let healthNumPos = new Vector( healthPos.x + healthWidth / 3, healthPos.y + healthHeight - 2 )
        drawText( enemy.health.toString(), healthNumPos.x, healthNumPos.y, 25, healthHeight, "black", "25px timesNewRoman" )
    }
    function drawCard( card, color = "white" ) {
        if ( color == "red" ) {
            c.drawImage( attack, card.position.x, card.position.y, card.width, card.height )
        } else if ( color == "blue" ) {
            c.drawImage( defend, card.position.x, card.position.y, card.width, card.height )
        } else {
            c.fillStyle = color
            c.fillRect( card.position.x, card.position.y, card.width, card.height )
            c.strokeRect( card.position.x, card.position.y, card.width, card.height, "black" )
        }
    }
    function drawRect( x, y, width, height, color = "black" ) {
        c.fillStyle = color
        c.fillRect( x, y, width, height )
    }
    function reload() {
        update()
        render()
        window.requestAnimationFrame( reload )
    }
    reload()
}