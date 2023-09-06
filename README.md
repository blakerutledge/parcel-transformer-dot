# parcel-transformer-dot

Transforms doT files to template functions

Compatible only with Parcel 2, and uses the latest 2.0 beta release of doT.js

# Install

```bash
npm install parcel-transformer-dot@git+https://github.com/blakerutledge/parcel-transformer-dot
yarn add parcel-transformer-dot@git+https://github.com/blakerutledge/parcel-transformer-dot
```

In your `.parcelrc` add: 
```json
"transformers": {
  "*.dot": ["parcel-transformer-dot"]
}
```

# Usage

Optionally, add the following config to your `package.json` file, the defaults are shown below:

```json
{
    "parcel-transformer-dot": {
        "argName": "it",
        "strip": "true",
        "selfContained": "false",
        // "defsDir": undefined
    }
}
```

Import your doT template:  

```html
<!-- template.dot -->
<div class="content">
    {{= message }}
</div>
```

```javascript
// index.js
import templateFunction from './template.dot'
const data = { message: "hello world" }
document.body.innerHTML = templateFunction( data );
```

# doT Usage

```
{{ }}	for evaluation
{{= }}	for interpolation
{{! }}	for interpolation with encoding
{{# }}	for compile-time evaluation/includes and partials
{{## #}}	for compile-time defines
{{? }}	for conditionals
{{~ }}	for array iteration
```
#### Interpolation
```
<div>Hi {{=it.name}}!</div>
<div>{{=it.age || ''}}</div>
```

#### Evaluation
You can just write valid javascript.. no need for something like Handlebars Helpers!
```
{{ for(var prop in it) { }}
<div>{{=prop}}</div>
{{ } }}
```

#### Partials
See below for re-useable partials
```
{{##def.snippet:
<div>{{=it.name}}</div>{{#def.joke}}
#}}

{{#def.snippet}}
```

#### Conditionals
Can stack as many "if-else's" as you need
```
{{? it.name }}
<div>Oh, I love your name, {{=it.name}}!</div>
{{?? it.age === 0}}
<div>Guess nobody named you yet!</div>
{{??}}
You are {{=it.age}} and still don't have a name?
{{?}}
```

#### Array and Object Iteration
```
{{~object:value:key}}
<div data-key="{{=key}}">{{=value}}</div>
{{~}}

{{~array:value:index}}
<div data-index="{{=index}}">{{=value}}</div>
{{~}}
```

#### Inline Files

There is a built in compile time helper to read and embed other text files into your template.

```
{{#def.loadfile("./src/assets/yourfile.svg") }}
```

# Partials + #def

Make sure to specify in the `package.json` file:

```json
"parcel-transformer-dot": {
    "defsDir": "src/templates/defs/"
}
```

#### `defsDir`
A relative path (local to your package.json file) specifying a directory of `.dot` files. Each file must specify only one doT partial. The name of the file is for your organization only. The partial should be defined as follows:
```
{{##def.my_partial:my_parameter:
    <div class="thing"> Partial: {{= my_paramter }} </div>
#}}
```

Then, in any of your standard templates, you may access these reuseable partials. Partials are only prepended to the templates that make use them.


# Credits
 - [doT](http://olado.github.io/doT/index.html) - The fastest + most concise javascript template engine for nodejs and browsers
 - [Parcel](https://parceljs.org/) - Zero configuration bundler