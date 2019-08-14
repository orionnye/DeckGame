function isValueType( object ) {
    return typeof object != "object" || object === null
}

export function markStatic( object ) {
    object.$static = true
}

export function markDirty( object, value ) {
    object.$dirty = value
}

export default function clone( cur, prev: any = undefined, cloned = new Map() ) {
    if ( isValueType( cur ) )
        return cur

    let unchanged = ( cur.$static === true ) || ( cur.$dirty === false )
    if ( unchanged && prev != undefined )
        return prev

    if ( cloned.has( cur ) )
        return cloned.get( cur )

    let result = new cur.constructor()
    let deepEqual = ( prev != undefined )
    cloned.set( cur, result )
    for ( let key of Object.keys( cur ) ) {
        if ( key == "$dirty" ) continue
        let curVal = cur[ key ]
        let prevVal = prev ? prev[ key ] : undefined
        let clonedVal = clone( curVal, prevVal, cloned )
        result[ key ] = clonedVal
        if ( clonedVal !== prevVal )
            deepEqual = false
    }

    if ( deepEqual )
        return prev

    return result
}

export function deepCompare( a, b, verbose = false, path: string[] = [], visitedA = new Map(), visitedB = new Map() ) {
    let pathStr = path.join( "." )
    let log = x => verbose ? console.log( x ) : null

    if ( a == b )
        return true

    if ( isValueType( a ) || isValueType( b ) ) {
        log( "value inequality at " + pathStr )
        log( a )
        log( b )
        return false
    }

    let topologicalNumberA = visitedA.get( a )
    let topologicalNumberB = visitedB.get( b )
    if ( topologicalNumberA !== topologicalNumberB ) {
        log( "topological inequality at " + pathStr )
        return false
    }

    if ( topologicalNumberA !== undefined )
        return true

    if ( !visitedA.has( a ) ) {
        visitedA.set( a, visitedA.size )
        visitedB.set( b, visitedB.size )
    }

    if ( a.constructor !== b.constructor ) {
        log( "constructor inequality at " + pathStr )
        return false
    }

    if ( Object.keys( a ).length != Object.keys( b ).length ) {
        log( "key count inequality at " + pathStr )
        return false
    }

    for ( let key of Object.keys( a ) ) {
        path.push( key )
        if ( !deepCompare( a[ key ], b[ key ], verbose, path, visitedA, visitedB ) )
            return false
        path.pop()
    }
    return true
}