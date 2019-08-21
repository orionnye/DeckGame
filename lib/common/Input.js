"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
const Canvas_1 = __importDefault(require("./Canvas"));
window.addEventListener("mousemove", e => {
    let rect = Canvas_1.default.canvas.getBoundingClientRect();
    Input.mouse = Vector_1.vector(e.x - rect.left, e.y - rect.top);
});
window.addEventListener("keydown", e => Input.buttons[e.key] = true);
window.addEventListener("keyup", e => Input.buttons[e.key] = false);
window.addEventListener("mousedown", e => Input.buttons["Mouse" + e.button] = true);
window.addEventListener("mouseup", e => Input.buttons["Mouse" + e.button] = false);
class Input {
}
Input.buttons = {};
exports.default = Input;
