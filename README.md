# parcel-transformer-dot
Transforms doT files to template functions

Works with Parcel 2

# Install

```bash
npm install --save-dev parcel-transformer-dot
yarn add -D parcel-transformer-dot
```

In your `.parcelrc` add: 
```json
"transformers": {
  "*.dot": ["parcel-transformer-dot"]
}
```

# Usage

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

# Credits
 - [doT](https://github.com/olado/doT/tree/v2) - The fastest + most concise javascript template engine for nodejs and browsers
 - [Parcel](https://parceljs.org/) - Zero configuration bundler