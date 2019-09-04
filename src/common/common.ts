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

export function memoize( func: ( any ) => any ) {
    let cache = {}
    return ( arg: any ) => {
        if ( cache[ arg ] )
            return cache[ arg ]
        let value = func( arg )
        cache[ arg ] = value
        return value
    }
}

export function contains( a, b, x ) {
    return x > Math.min( a, b ) && x < Math.max( a, b )
}

export function overlaps( a0, a1, b0, b1 ) {
    return contains( a0, a1, b0 ) || contains( a0, a1, b1 )
}