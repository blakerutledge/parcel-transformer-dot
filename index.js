import * as fs from "fs"
import * as path from "path"
import doT from "dot"
import { Transformer } from "@parcel/plugin"

const transformer = new Transformer({
    
    async loadConfig( { config } ) {
        const packageJson = await config.getPackage()
        const transform_config = packageJson?.[ 'parcel-transformer-dot' ]
        if ( Object.prototype.toString.call( transform_config ) === '[object Object]' ) {
            return Promise.resolve( transform_config )
        }
        return Promise.resolve( {} )
    },

    async transform( { asset, config } ) {
        
        let content = await asset.getCode()
        
        // ALLOW inlining files into other files
        let defs = {
            loadfile: function(path) { return fs.readFileSync( path ) }
        }

        // SIMPLE config values
        if (config.argName) {
            doT.templateSettings.argName = config.argName
        }

        if (config.strip) {
            doT.templateSettings.strip = config.strip === 'true'
        }

        if (config.selfContained) {
            doT.templateSettings.selfContained = config.selfContained === 'true'
        }

        // CUSTOM def's path from config
        let defs_path = config.defsDir
            ? path.join(process.cwd(), config.defsDir)
            : undefined
        
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
