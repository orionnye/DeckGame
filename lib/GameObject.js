"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./common/Vector");
const BoundingBoxUtils_1 = require("./common/BoundingBoxUtils");
class GameObject {
    constructor(position, width, height) {
        this.position = Vector_1.vector(0, 0);
        this.width = 0;
        this.height = 0;
        this.sprite = null;
        this.position = position;
        this.width = width;
        this.height = height;
    }
    get dimensions() { return Vector_1.vector(this.width, this.height); }
    contains(p) { return BoundingBoxUtils_1.boxContains(this, p); }
    overlaps(other) { return BoundingBoxUtils_1.boxOverlaps(this, other); }
}
exports.default = GameObject;
