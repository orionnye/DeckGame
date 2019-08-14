const childProcess = require( "child_process" )
const { spawn } = childProcess

const windows = process.platform == "win32"

function run( command, arg ) {
    let args = [arg]
    let cp = spawn( command + ( windows ? ".cmd" : "" ), args, { stdio: [process.stdin, process.stdout, process.stderr] } )
    cp.on( "error", ( err ) => {
        console.log( `Error running ${command} ${args.join( ' ' )}: ${err}` )
    } )
}

run( "yarn", "watch" )
run( "yarn", "webpack" )