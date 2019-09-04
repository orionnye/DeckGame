import Vector, { vector } from "./Vector";
import Canvas from "./Canvas";

window.addEventListener( "mousemove", e => {
    let rect = Canvas.canvas.getBoundingClientRect()
    Input.mouse = vector(
        e.x - rect.left,
        e.y - rect.top
    )
} )

window.addEventListener( "keydown", e => Input.buttons[ e.key ] = true )
window.addEventListener( "keyup", e => Input.buttons[ e.key ] = false )

window.addEventListener( "mousedown", e => Input.buttons[ "Mouse" + e.button ] = true )
window.addEventListener( "mouseup", e => Input.buttons[ "Mouse" + e.button ] = false )

export default class Input {
    static mouse: Vector
    static buttons: { [ name: string ]: boolean } = {}
}