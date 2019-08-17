"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const left = (b) => b.position.x;
const right = (b) => b.position.x + b.width;
const top = (b) => b.position.y;
const bottom = (b) => b.position.y + b.height;
function boxContains(b, p) {
    let xContains = common_1.contains(left(b), right(b), p.x);
    let yContains = common_1.contains(top(b), bottom(b), p.y);
    return xContains && yContains;
}
exports.boxContains = boxContains;
function boxOverlaps(b0, b1) {
    let xOverlaps = common_1.overlaps(left(b0), right(b0), left(b1), right(b1));
    let yOverlaps = common_1.overlaps(top(b0), bottom(b0), top(b1), bottom(b1));
    return xOverlaps && yOverlaps;
}
exports.boxOverlaps = boxOverlaps;
