"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./common/Vector"));
const Canvas_1 = __importDefault(require("./common/Canvas"));
const GameObject_1 = __importDefault(require("./GameObject"));
class Pawn extends GameObject_1.default {
    constructor(x, y, width, height, color = "red", health = 10) {
        super(new Vector_1.default(x, y), width, height);
        this.offset = new Vector_1.default(0, 0);
        this.color = color;
        this.health = health;
        this.sprite = null;
    }
    updateToFixed() {
        if (this.offset.length > 0) {
            this.offset;
            if (this.position.subtract(this.offset).length > 2) {
                let fixVector = new Vector_1.default(0, 0).subtract(this.offset);
                this.offset = fixVector.unit.multiply(fixVector.length / 2);
            }
            if (this.offset.length < 3)
                this.offset = new Vector_1.default(0, 0);
        }
    }
    draw() {
        if (this.sprite) {
            let { sprite, position, width, height } = this;
            let { x, y } = position;
            let { x: dx, y: dy } = this.offset;
            sprite.draw(x + width / 2 + dx, y + height / 2 + dy, true);
        }
        else {
            this.drawBasic();
        }
        this.drawHealthBar();
    }
    drawBasic() {
        Canvas_1.default.rect(this.position.x + this.offset.x, this.position.y + this.offset.y, this.width, this.height).fillStyle(this.color).fill();
        if (this.health <= 0)
            Canvas_1.default.fillStyle("black").text("Dead", this.position.x + this.offset.x, this.position.y + this.offset.y + this.height / 2, this.width);
    }
    drawHealthBar() {
        let healthHeight = 20;
        let healthWidth = this.health * 10;
        let healthPos = this.position.addY(this.height + 5);
        let healthNumPos = healthPos.addXY(healthWidth / 3, healthHeight - 2);
        Canvas_1.default.rect(healthPos.x, healthPos.y, healthWidth, healthHeight).fillStyle("red").fill().stroke();
        Canvas_1.default.fillStyle("black")
            .text(this.health.toString(), healthNumPos.x, healthNumPos.y, 25, "25px timesNewRoman");
    }
}
exports.default = Pawn;
