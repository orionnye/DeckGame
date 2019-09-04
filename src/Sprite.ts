import Canvas from "./common/Canvas";

type ImageSource = {
    x: number,
    y: number
    w: number,
    h: number
}

export default class Sprite {
    image: HTMLImageElement
    w: number | null = null
    h: number | null = null
    source: ImageSource | null = null

    get width() { return this.w || this.image.width }
    get height() { return this.h || this.image.height }

    constructor( image: HTMLImageElement ) {
        this.image = image
    }

    setDimensions( w, h ) {
        this.w = w
        this.h = h
        return this
    }

    setSource( source: ImageSource ) {
        this.source = source
        return this
    }

    draw( x = 0, y = 0, center = false ) {
        let { image, source, width, height } = this

        if ( center ) {
            x -= width / 2
            y -= height / 2
        }

        if ( source )
            Canvas.imageSource( source.x, source.y, source.w, source.h ).partialImage( this.image, x, y, width, height )
        else
            Canvas.image( image, x, y, width, height )
    }
}