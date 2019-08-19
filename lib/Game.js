"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = __importDefault(require("./common/Canvas"));
const Deck_1 = __importDefault(require("./Deck"));
const Pawn_1 = __importDefault(require("./Pawn"));
const Input_1 = __importDefault(require("./common/Input"));
const common_1 = require("./common/common");
const Card_1 = __importDefault(require("./Card"));
const Melter_1 = __importDefault(require("./Melter"));
const Sprite_1 = __importDefault(require("./Sprite"));
class Game {
    constructor() {
        this.deck = new Deck_1.default(20, 30, 250, -1, 1);
        this.hand = new Deck_1.default(5, 145, 250, 90, 0);
        this.discard = new Deck_1.default(0, 600, 250, 1, 1);
        this.player = new Pawn_1.default(100, 50, 175, 175, "red");
        this.enemy = new Pawn_1.default(500, 50, 150, 150, "blue", 5);
        this.melter = new Melter_1.default(325, 375);
        this.handCap = 5;
        this.grabbing = false;
        window.addEventListener("keyup", e => this.keyup(e));
        this.player.sprite = new Sprite_1.default(common_1.getImage("PawnEgor"))
            .setSource({ x: 0, y: 0, w: 69, h: 69 })
            .setDimensions(this.player.width, this.player.height);
        this.enemy.sprite = new Sprite_1.default(common_1.getImage("PawnChadwick2"))
            .setSource({ x: 0, y: 0, w: 60, h: 64 })
            .setDimensions(this.enemy.width * 0.8, this.enemy.height * 0.8);
    }
    get pawns() {
        return [this.player, this.enemy];
    }
    keyup(e) {
        let { deck, hand } = this;
        if (e.key == "Enter")
            if (hand.length == 0 && deck.length > 0)
                this.endTurn();
    }
    endTurn() {
        let { enemy, player, melter, deck } = this;
        if (enemy.health > 0) {
            player.health -= 2;
            enemy.health += 2;
            enemy.offset.x = -60;
            player.offset.x = -20;
        }
        this.refillHand();
        deck.cards.push(melter.product);
        // console.log( melter.product )
        melter.base = new Card_1.default(melter.position, "grey");
        melter.colors = [];
    }
    refillHand() {
        let { deck, hand, discard, handCap } = this;
        if (deck.length < handCap) {
            for (let card of deck.cards)
                hand.cards.push(card);
            deck.cards = discard.cards;
            discard.cards = [];
        }
        while (hand.length < handCap)
            deck.transferCard(hand);
    }
    update() {
        this.render();
        let { deck, hand, discard, enemy, player } = this;
        let { buttons } = Input_1.default;
        if (player.offset.length > 1)
            player.updateToFixed();
        enemy.updateToFixed();
        hand.updateToFixed();
        discard.updateToFixed();
        deck.updateToFixed();
        for (let card of hand.cards)
            card.update(this);
        if (!buttons.Mouse0 && hand.length > 0)
            for (let card of hand.cards)
                card.grabbed = false;
    }
    render() {
        let { deck, hand, discard } = this;
        Canvas_1.default.resize(700, 500);
        Canvas_1.default.context.imageSmoothingEnabled = false;
        Canvas_1.default.background("grey");
        let backgroundY = 150;
        Canvas_1.default.image(common_1.getImage("Ground"), 0, backgroundY - 5, Canvas_1.default.canvas.clientWidth, 200);
        Canvas_1.default.image(common_1.getImage("BackGroundMid"), 0, 0, Canvas_1.default.canvas.clientWidth, backgroundY);
        this.melter.draw();
        for (let pawn of this.pawns)
            pawn.draw();
        deck.draw();
        discard.draw();
        hand.draw(false);
    }
}
exports.default = Game;
