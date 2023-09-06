const fs = require('fs')
const path = require('path')
const doT = require('dot')
const { Transformer } = require("@parcel/plugin")

const transformer = new Transformer({
    async transform({ asset }) {

        let content = await asset.getCode();

        // 
        // INLINE svg assets
        // 

        let regex = /<include src=(.*?)\/>/g;
        let includes = content.match(regex);
        let cache = {}
        for (let match in includes) {

            let file = includes[match]

            file = file.replace(/<include src=/g, "")
                .replace(/\/>/g, "")
                .replace(/"/g, "")
                .replace(/'/g, "");

            file = file.trim()

            // HACK this should be better but it works for me
            file = path.join(__dirname, '..', '..', 'src', 'frontend', file)

            let svg = (cache[file])
                ? cache[file]
                : fs.readFileSync(file, 'utf-8')

            cache[file] = (cache[file])
                ? cache[file]
                : svg

            content = content.replace(includes[match], cache[file])

        }

        //
        // doT Template 
        // 
        
        let defs = {}
        defs.loadfile = function(path) {
            return fs.readFileSync(process.argv[1].replace(/\/[^\/]*$/,path));
        };
        
        // const precompiled = Handlebars.precompile(content, { knownHelpers: helpers });
        const precompiled = doT.template( content, undefined, defs )

        asset.setCode(`
        export default ${precompiled}`)
        asset.type = "js"
        return [asset];
    },
});





module.exports = transformer;
