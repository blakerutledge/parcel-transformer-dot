import * as fs from "fs"
import * as path from "path"
import doT from "dot"
import { Transformer } from "@parcel/plugin"

const transformer = new Transformer( {

    async transform( { asset } ) {

        let content = await asset.getCode()
        
        // ALLOW inlining files into other files
        let defs = {
            loadfile: function(path) { return fs.readFileSync( path ) }
        }
        console.log( process.cwd() )
        // Get custom def's from specified dist
        let defs_path = path.join( process.cwd(), "src", "frontend", "templates", "defs" )
        if ( defs_path !== undefined ) {
            
            // List all files
            const defs_files = await fs.promises.readdir(defs_path)
            
            // Read all files
            const files = await Promise.all(
                defs_files.map( async (filename) => {
                    const filepath = path.join(defs_path, filename)
                    return fs.promises.readFile(filepath, { encoding: "utf-8" })
                } )
            )

            // Test & Prepend any used defines
            files.forEach( f => {
                let name = f.split(":")[0].replace("{{##def.", "")
                let usage = `{{#def.${name}:`
                if (content.includes(usage)) {
                    content = f + "\n\n" + content
                }
            } )

        }
        
        const precompiled = doT.template( content, undefined, defs )
        
        asset.setCode( `export default ${ precompiled}` )
        asset.type = "js"
        return [ asset ]
        
    }

} )

export default transformer
