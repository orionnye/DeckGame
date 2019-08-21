"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./common/Vector");
const Card_1 = __importDefault(require("./Card"));
const Canvas_1 = __importDefault(require("./common/Canvas"));
const GameObject_1 = __importDefault(require("./GameObject"));
class Melter extends GameObject_1.default {
    constructor(x, y) {
        super(Vector_1.vector(x, y), 200, 130);
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
        Canvas_1.default.vrect(pos, this.dimensions)
            .fillStyle("black").fill();
        Canvas_1.default.vrect(this.position, this.product.dimensions)
            .fillStyle("blue").fill();
    }
}
exports.default = Melter;
