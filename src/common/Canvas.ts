import Vector from "./Vector";

export default class Canvas {

    static canvas: HTMLCanvasElement
    static context: CanvasRenderingContext2D

    private static _imageSource = {
        x: 0, y: 0,
        w: 0, h: 0
    }

    static setup() {
        Canvas.canvas = document.getElementById( "canvas" ) as HTMLCanvasElement
        Canvas.context = Canvas.canvas.getContext( "2d" ) as CanvasRenderingContext2D
    }

    static resize( w, h ) {
        Canvas.canvas.width = w
        Canvas.canvas.height = h
    }

    static fitWindow() {
        Canvas.resize( innerWidth, innerHeight )
    }

    static background( style ) {
        let { canvas, context: c } = Canvas
        c.fillStyle = style
        c.fillRect( 0, 0, canvas.width, canvas.height )
        return Canvas
    }

    static vline( a: Vector, b: Vector ) { Canvas.line( a.x, a.y, b.x, b.y ); return Canvas }
    static line( x1, y1, x2, y2 ) {
        let { context: c } = Canvas
        c.beginPath()
        c.moveTo( x1, y1 )
        c.lineTo( x2, y2 )
        c.closePath()
        return Canvas
    }

    static vrect( p: Vector, dimensions: Vector ) { Canvas.rect( p.x, p.y, dimensions.x, dimensions.y ); return Canvas }
    static rect( x, y, w, h ) {
        let { context: c } = Canvas
        c.beginPath()
        c.rect( x, y, w, h )
        c.closePath()
        return Canvas
    }

    static vcircle( p: Vector, r ) { Canvas.circle( p.x, p.y, r ); return Canvas }
    static circle( x, y, r ) {
        let { context: c } = Canvas
        c.beginPath()
        c.ellipse( x, y, r, r, 0, 0, Math.PI * 2 )
        c.closePath()
        return Canvas
    }

    static stroke() {
        Canvas.context.stroke()
        return Canvas
    }

    static fill() {
        Canvas.context.fill()
        return Canvas
    }

    static strokeStyle( style ) {
        Canvas.context.strokeStyle = style
        return Canvas
    }

    static fillStyle( style ) {
        Canvas.context.fillStyle = style
        return Canvas
    }

    static vimage( image, p: Vector, dimensions: Vector ) { Canvas.image( image, p.x, p.y, dimensions.x, dimensions.y ); return Canvas }
    static image( image, dx = 0, dy = 0, w = 0, h = 0 ) {
        w = w || image.width
        h = h || image.height
        Canvas.context.drawImage( image, dx, dy, w, h )
        return Canvas
    }

    static vpartialImage( image, p: Vector, dimensions: Vector ) { Canvas.partialImage( image, p.x, p.y, dimensions.x, dimensions.y ); return Canvas }
    static partialImage( image, x, y, w, h ) {
        let { _imageSource: imageSource } = Canvas
        w = w || imageSource.w
        h = h || imageSource.h
        Canvas.context.drawImage(
            image,
            imageSource.x, imageSource.y,
            imageSource.w, imageSource.h,
            x, y, w, h
        )
    }

    static vimageSource( p: Vector, dimensions: Vector ) { Canvas.imageSource( p.x, p.y, dimensions.x, dimensions.y ); return Canvas }
    static imageSource( x, y, w, h ) {
        Canvas._imageSource = { x, y, w, h }
        return Canvas
    }

    static vtranslate( p: Vector ) { Canvas.translate( p.x, p.y ); return Canvas }
    static translate( x, y ) {
        // Canvas.context.translate( Math.round( x ), Math.round( y ) )
        Canvas.context.translate( x, y )
        return Canvas
    }

    static rotate( angle ) {
        Canvas.context.rotate( angle )
        return Canvas
    }

    static vscale( v: Vector ) { Canvas.scale( v.x, v.y ); return Canvas }
    static scale( x, y ) {
        Canvas.context.scale( x, y )
        return Canvas
    }

    static vtext( text, p: Vector, width, font = "50px pixel" ) { Canvas.text( text, p.x, p.y, width, font ); return Canvas }
    static text( text, x, y, width, font = "50px pixel" ) {
        let c = Canvas.context
        c.font = font
        c.fillText( text, x, y, width )
        return Canvas
    }

    static push() {
        Canvas.context.save()
        return Canvas
    }

    static pop() {
        Canvas.context.restore()
        return Canvas
    }
}