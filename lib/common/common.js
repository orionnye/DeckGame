"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function modulus(n, m) {
    return ((n % m) + m) % m;
}
exports.modulus = modulus;
function forRect(x0, y0, x1, y1, action) {
    for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++)
            action(x, y);
}
exports.forRect = forRect;
function forRectInclusive(x0, y0, x1, y1, action) {
    forRect(x0, y0, x1 + 1, y1 + 1, action);
}
exports.forRectInclusive = forRectInclusive;
const cache = {};
function getImage(name, extension = "png") {
    if (cache[name])
        return cache[name];
    let img = new Image();
    img.src = "/assets/" + name + "." + extension;
    cache[name] = img;
    return img;
}
exports.getImage = getImage;
function contains(a, b, x) {
    return x > Math.min(a, b) && x < Math.max(a, b);
}
exports.contains = contains;
function overlaps(a0, a1, b0, b1) {
    return contains(a0, a1, b0) || contains(a0, a1, b1);
}
exports.overlaps = overlaps;
