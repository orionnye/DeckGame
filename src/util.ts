let tasks = new Set<string>()
export function scheduleTask( name: string, milis: number, run: Function ) {
    if ( tasks.has( name ) )
        return false
    tasks.add( name )
    setTimeout( () => {
        try {
            run()
        } catch ( e ) {
            throw e
        } finally {
            tasks.delete( name )
        }
    }, milis )
    return true
}