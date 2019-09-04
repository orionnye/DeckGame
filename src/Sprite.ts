import Canvas from "./common/Canvas";
import Vector from "./common/Vector";

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
    changeFrame(newX: number, newY: number) {
        let { source } = this
        if ( source ) {
            source.x = newX
            source.y = newY
        }
        else
            console.error("assign a image source before you change frames")
    }

    animate( frameDelay: number, frameCount: number ) {
        let { source } = this
        if ( source ) {
            this.changeFrame(source.x + source.w, 0)
            let newFrameCount = frameCount - 1
            if (frameCount > 0) {
                window.setTimeout(() => {
                    this.animate(frameDelay, newFrameCount)
                }, frameDelay)
            } else {
                this.changeFrame(0, 0)
            }
        }
        else {
            console.error("Must set source before animating")
            return
        }
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