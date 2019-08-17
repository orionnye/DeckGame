"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("./Game"));
const Canvas_1 = __importDefault(require("./common/Canvas"));
let game = new Game_1.default();
window.onload = () => {
    Canvas_1.default.setup();
    function loop() {
        game.update();
        requestAnimationFrame(loop);
    }
    loop();
};
