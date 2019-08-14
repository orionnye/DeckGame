import test from "ava"
import { deepCompare } from "./clone";

test( "deepCompare", t => {


    t.assert(
        deepCompare(
            { a: { id: 0 }, b: { id: 0 } },
            { a: { id: 0 }, b: { id: 0 } }
        )
    )

    t.assert(
        !deepCompare(
            { a: { id: 0 }, b: { id: 1 } },
            { a: { id: 0 }, b: { id: 0 } }
        )
    )

    // These are topologically different.
    // If two paths lead to the same vertex in one graph,
    // the same must be true of those paths in the other graph.
    let repeatedVertex = { id: 0 }
    t.assert(
        !deepCompare(
            { a: { id: 0 }, b: { id: 0 } },
            { a: repeatedVertex, b: repeatedVertex }
        )
    )

    let makeCycle = () => {
        let a = { nextA: {} }
        let b = { nextB: a }
        a.nextA = b
        return a
    }

    let cycleA = makeCycle()
    let cycleB = makeCycle()
    t.assert(
        deepCompare(
            cycleA,
            cycleB
        )
    )

    t.assert(
        !deepCompare(
            cycleA,
            cycleB.nextA
        )
    )

} )