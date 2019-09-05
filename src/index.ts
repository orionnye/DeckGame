import Game from "./Game";
import Canvas from "geode/lib/Canvas";

let game = new Game()

window.onload = () => {
    Canvas.setup()
    function loop() {
        game.update()
        requestAnimationFrame( loop )
    }
    loop()
}