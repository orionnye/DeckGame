"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = __importDefault(require("./common/Canvas"));
const common_1 = require("./common/common");
const Input_1 = __importDefault(require("./common/Input"));
const GameObject_1 = __importDefault(require("./GameObject"));
class Card extends GameObject_1.default {
    constructor(position, color = "red") {
        super(position, 69, 100);
        this.position = position;
        this.color = color;
        this.grabbed = false;
    }
    apply(pawn, hand, discard) {
        let countOccurances = (regex, str) => [...str.matchAll(regex)].length;
        let blueCount = countOccurances(/(blue)/g, this.color);
        let redCount = countOccurances(/(red)/g, this.color);
        pawn.offset.y = -30;
        hand.remove(this);
        let random = (discard.length == 0) ? 0 : Math.floor(Math.random() * discard.length);
        discard.insertAt(this, random);
        pawn.health += blueCount - redCount;
        if (this.color == "grey") {
            let heal = (Math.random() > 0.5) ? true : false;
            pawn.health += heal ? 2 : -2;
        }
        this.grabbed = false;
    }
    update(game) {
        let { mouse, buttons } = Input_1.default;
        let { hand, discard, pawns, melter } = game;
        if (buttons.Mouse0) {
            if (this.contains(mouse) && !game.grabbing) {
                game.grabbing = true;
                this.grabbed = true;
            }
        }
        else {
            game.grabbing = false;
        }
        if (this.grabbed) {
            this.position = mouse.subtract(this.dimensions.half);
        }
        else {
            for (let pawn of pawns)
                if (pawn.overlaps(this))
                    this.apply(pawn, hand, discard);
            if (melter.overlaps(this)) {
                console.log("MELTED in", this.color);
                melter.melt(this);
                hand.remove(this);
                this.color = "grey";
            }
        }
    }
    draw(color = "white") {
        let { position, width, height } = this;
        let { x, y } = position;
        let margin = width / 12;
        if (color == "red")
            Canvas_1.default.image(common_1.getImage("CardATK1"), x, y, width, height);
        else if (color == "redred")
            Canvas_1.default.image(common_1.getImage("CardATK2"), x, y, width, height);
        else if (color == "blue")
            Canvas_1.default.image(common_1.getImage("CardHP1"), x, y, width, height);
        else if (color == "blueblue")
            Canvas_1.default.image(common_1.getImage("CardKarma"), x, y, width, height);
        else
            Canvas_1.default.image(common_1.getImage("CardVolatile"), x, y, width, height);
        //Text IDEALLY would print the card description contained on the card
        Canvas_1.default.text(color, x + margin, y + height - margin, width - margin * 2, "20px pixel");
    }
}
exports.default = Card;
