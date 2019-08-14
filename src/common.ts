export function modulus( n, m ) {
    return ( ( n % m ) + m ) % m
}

export function forRect( x0, y0, x1, y1, action ) {
    for ( let y = y0; y < y1; y++ )
        for ( let x = x0; x < x1; x++ )
            action( x, y )
}

export function forRectInclusive( x0, y0, x1, y1, action ) {
    forRect( x0, y0, x1 + 1, y1 + 1, action )
}

const cache = {}
export function getImage( name: string, extension = "png" ) {
    if ( cache[ name ] )
        return cache[ name ]
    let img = new Image()
    img.src = "/assets/" + name + "." + extension
    cache[ name ] = img
    return img
}