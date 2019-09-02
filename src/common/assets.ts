const cache = {}
export function getAsset( name: string, extension: string, fromPath: ( string ) => any ) {
    let path = "/assets/" + name + "." + extension
    if ( cache[ path ] )
        return cache[ path ]
    let asset = fromPath( path )
    cache[ path ] = asset
    return asset
}

export function getImage( name: string, extension = "png" ) {
    return getAsset( name, extension, path => {
        let img = new Image()
        img.src = path
        return img
    } ) as HTMLImageElement
}

export function getAudio( name: string, extension = "mp3" ) {
    return getAsset( name, extension, path => new Audio( path ) ) as HTMLAudioElement
}