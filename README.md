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

```javascript
// index.js
import templateFunction from './template.dot';
document.body.innerHTML = templateFunction();
```

Import `index.js` from your `index.html` file:

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

# Credits
 - [doT](https://github.com/olado/doT/tree/v2) - The fastest + most concise javascript template engine for nodejs and browsers
 - [Parcel](https://parceljs.org/) - Zero configuration bundler