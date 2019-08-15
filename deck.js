class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    get normalize() {
        return new Vector(this.x / this.length, this.y / this.length)
    }
    add(addedVector) {
        return new Vector(this.x + addedVector.x, this.y + addedVector.y)
    }
    subtract(subtractedVector) {
        return new Vector(this.x - subtractedVector.x, this.y - subtractedVector.y)
    }
    dot(other) {
        return this.x * other.x + this.y * other.y
    }
    multiply(scale) {
        return new Vector(this.x * scale, this.y * scale)
    }
    toString() {
        return `(${this.x.toFixed(2)},${this.y.toFixed(2)})`
    }
}
class Deck {
    constructor(count, x, y, offsetX, offsetY) {
        let cards = []
        this.offsetX = offsetX
        this.offsetY = offsetY
        for (let i = 0; i < count; i++) {
            let deckPos = new Vector(x + this.offsetX * i, y + this.offsetY * i)
            // let rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
            let rainbow = ["red", "red", "blue", "blue", "blue", "red", "red"]
            let randColor = rainbow[Math.floor(Math.random() * rainbow.length)]
            let card = new Card(deckPos, randColor)
            cards.push(card)
        }
        this.cards = cards
        this.position = new Vector(x, y)
    }
    get length() {
        return this.cards.length
    }
    remove(card) {
        let index = this.cards.indexOf(card)
        let store = this.cards[this.cards.length - 1]
        this.cards[index] = store
        this.cards.pop()
    }
    insertAt(card, index) {
        if (this.length == 0) {
            this.cards.push(card)
            return
        }
        let store = this.cards[index]
        this.cards[index] = card
        this.cards.push(store)
    }
    insertAtRandom(card) {
        let random = (discardPile.length == 0) ? 0 : Math.floor(Math.random() * discardPile.length)
        this.insertAt(card, random)
    }
    updateToFixed() {
        if (this.cards.length > 0) {
            this.cards.forEach(card => {
                //  lock in card positions
                let index = this.cards.indexOf(card)
                //  x + this.offsetX * i
                let fixedX = this.position.x + index * this.offsetX
                let fixedY = this.position.y + index * this.offsetY
                let fixedPos = new Vector(fixedX, fixedY)
                if (fixedPos.subtract(card.position).length > 1) {
                    let fixVector = fixedPos.subtract(card.position)
                    card.position = card.position.add(fixVector.normalize.multiply(fixVector.length / 20))
                }
            })
        }
    }
}
class Card {
    constructor(position, color = "red") {
        this.position = position
        this.width = 69
        this.height = 100
        this.color = color
        this.grabbed = false
    }
    contains(point) {
        if (point.x < this.position.x + this.width && point.x > this.position.x) {
            if (point.y < this.position.y + this.height && point.y > this.position.y) {
                return true
            }
        }
        return false
    }
}
class Box {
    constructor(x, y, width, height, color = "red") {
        this.position = new Vector(x, y)
        this.offSet = new Vector(0, 0)
        this.width = width
        this.height = height
        this.color = color
        this.health = 10
    }
    collidesWith(other) {
        let myCenter = new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
        let otherCenter = new Vector(other.position.x + other.width / 2, other.position.y + other.height / 2)
        let distance = otherCenter.subtract(myCenter).length
        if (distance < this.width) {
            return true
        } else {
            return false
        }
    }
    updateToFixed() {
        if (this.offSet.length > 0) {
            this.offSet
            if (this.position.subtract(this.offSet).length > 2) {
                let fixVector = new Vector(0, 0).subtract(this.offSet)
                this.offSet = fixVector.normalize.multiply(fixVector.length / 2)
            }
            if (this.offSet.length < 3) {
                this.offSet = new Vector(0, 0)
            }
        }
    }
}
class Melter {
    constructor(x, y) {
        this.position = new Vector(x, y)
        this.colors = []
        this.base = new Card(this.position, "grey")
        this.width = 200
        this.height = 130
    }
    get product() {
        if (this.colors.length == 0) {
            return this.base
        }
        let endColor = ""
        this.colors.forEach(color => {
            let compColor = endColor.toString() + color.toString()
            endColor = compColor
        })
        let concoction = new Card(this.base.position, endColor)
        return concoction
    }
    contains(card) {
        let {position, base} = this
        //  check card for collision
        let upLeft = position
        let lowLeft = new Vector(position.x, position.y + base.height)
        let upRight = new Vector(position.x + base.width, position.y)
        let lowRight = new Vector(position.x + base.width, position.y + base.height)
        if (!card.grabbed) {
            if (card.contains(upLeft) || card.contains(lowLeft)) {
                return true
            }
            if (card.contains(upRight) || card.contains(lowRight)) {
                return true
            }
        }
        return false
    }
    melt(card) {
        this.colors.push(card.color)
    }
}