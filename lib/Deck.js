"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./common/Vector"));
const Card_1 = __importDefault(require("./Card"));
const Canvas_1 = __importDefault(require("./common/Canvas"));
const GameObject_1 = __importDefault(require("./GameObject"));
class Deck extends GameObject_1.default {
    constructor(count, x, y, spreadX, spreadY) {
        super(new Vector_1.default(x, y), 0, 0);
        this.spread = new Vector_1.default(spreadX, spreadY);
        let cards = [];
        for (let i = 0; i < count; i++) {
            let deckPos = new Vector_1.default(x + spreadX * i, y + spreadY * i);
            // let rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
            let rainbow = ["red", "blue"];
            let randColor = rainbow[Math.floor(Math.random() * rainbow.length)];
            let card = new Card_1.default(deckPos, randColor);
            cards.push(card);
        }
        this.cards = cards;
    }
    get length() { return this.cards.length; }
    remove(card) {
        let index = this.cards.indexOf(card);
        let store = this.cards[this.length - 1];
        this.cards[index] = store;
        this.cards.pop();
    }
    insertAt(card, index) {
        if (this.length == 0) {
            this.cards.push(card);
            return;
        }
        let store = this.cards[index];
        this.cards[index] = card;
        this.cards.push(store);
    }
    insertAtRandom(card) {
        let random = Math.floor(Math.random() * this.length);
        this.insertAt(card, random);
    }
    transferCard(destination) {
        let card = this.cards.pop();
        if (card)
            destination.cards.push(card);
    }
    updateToFixed() {
        this.cards.forEach(card => {
            let fixedPos = this.cardPosition(card);
            if (fixedPos.subtract(card.position).length > 1) {
                let fixVector = fixedPos.subtract(card.position);
                card.position = card.position.add(fixVector.unit.multiply(fixVector.length / 10));
            }
        });
    }
    cardPosition(card) {
        let index = this.cards.indexOf(card);
        return this.position.add(this.spread.multiply(index));
    }
    draw(stack = true) {
        for (let card of this.cards) {
            if (stack)
                card.draw();
            else
                card.draw(card.color);
        }
        if (stack && this.length >= 0) {
            let lastCard = this.cards[this.length - 1];
            if (!lastCard)
                return;
            let textX = lastCard.position.x;
            let textY = lastCard.position.y + lastCard.height / 2;
            Canvas_1.default.fillStyle("black")
                .text(this.length.toString(), textX, textY, lastCard.width);
        }
    }
}
exports.default = Deck;
