"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./common/Vector"));
const BoundingBoxUtils_1 = require("./common/BoundingBoxUtils");
class GameObject {
    constructor(position, width, height) {
        this.position = new Vector_1.default(0, 0);
        this.width = 0;
        this.height = 0;
        this.sprite = null;
        this.position = position;
        this.width = width;
        this.height = height;
    }
    get dimensions() { return new Vector_1.default(this.width, this.height); }
    contains(p) { return BoundingBoxUtils_1.boxContains(this, p); }
    overlaps(other) { return BoundingBoxUtils_1.boxOverlaps(this, other); }
}
exports.default = GameObject;
