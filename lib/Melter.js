"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./common/Vector"));
const Card_1 = __importDefault(require("./Card"));
const Canvas_1 = __importDefault(require("./common/Canvas"));
const GameObject_1 = __importDefault(require("./GameObject"));
class Melter extends GameObject_1.default {
    constructor(x, y) {
        super(new Vector_1.default(x, y), 200, 130);
        this.colors = [];
        this.base = new Card_1.default(this.position, "grey");
    }
    get product() {
        if (this.colors.length == 0) {
            return this.base;
        }
        let endColor = "";
        this.colors.forEach(color => {
            let compColor = endColor.toString() + color.toString();
            endColor = compColor;
        });
        let concoction = new Card_1.default(this.base.position, endColor);
        return concoction;
    }
    melt(card) {
        this.colors.push(card.color);
    }
    draw() {
        let margin = (this.height - this.product.height) / 2;
        let pos = this.position.addXY(-this.product.width, -margin);
        Canvas_1.default.rect(pos.x, pos.y, this.width, this.height)
            .fillStyle("black").fill();
        Canvas_1.default.rect(this.position.x, this.position.y, this.product.width, this.product.height)
            .fillStyle("blue").fill();
    }
}
exports.default = Melter;
