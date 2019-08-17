"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = __importDefault(require("./common/Canvas"));
class Sprite {
    constructor(image) {
        this.w = null;
        this.h = null;
        this.source = null;
        this.image = image;
    }
    get width() { return this.w || this.image.width; }
    get height() { return this.h || this.image.height; }
    setDimensions(w, h) {
        this.w = w;
        this.h = h;
        return this;
    }
    setSource(source) {
        this.source = source;
        return this;
    }
    draw(x = 0, y = 0, center = false) {
        let { image, source, width, height } = this;
        if (center) {
            x -= width / 2;
            y -= height / 2;
        }
        if (source)
            Canvas_1.default.imageSource(source.x, source.y, source.w, source.h).partialImage(this.image, x, y, width, height);
        else
            Canvas_1.default.image(image, x, y, width, height);
    }
}
exports.default = Sprite;
