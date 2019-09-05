import Sprite from "geode/lib/Sprite";

export default function animateSprite( sprite: Sprite, frameDelay: number, frameCount: number ) {
    let { source } = sprite
    if ( source ) {
        changeFrame( source.x + source.w, 0 )
        let newFrameCount = frameCount - 1
        if ( frameCount > 0 ) {
            window.setTimeout( () => {
                animateSprite( sprite, frameDelay, newFrameCount )
            }, frameDelay )
        } else {
            changeFrame( 0, 0 )
        }
    }
    else {
        console.error( "Must set source before animating." )
        return
    }

    function changeFrame( newX: number, newY: number ) {
        let { source } = sprite
        if ( source ) {
            source.x = newX
            source.y = newY
        }
        else {
            console.error( "Must assign a image source before changing frames." )
        }
    }
}