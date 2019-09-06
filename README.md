# css-dot-js-loader [![npm version](https://badge.fury.io/js/css-dot-js-loader.svg)](https://badge.fury.io/js/css-dot-js-loader)

This Webpack loader allows to generate static CSS code via JavaScript. It's created for cases when you want to get all the power of JavaScript (loops, regular variables, functions etc) and use it to generate your CSS file. The loader doesn't replace CSS preprocessors (such as Sass or PostCSS) but helps you if you want to avoid weird and rigid syntax which is made to bring programming features into CSS (personally me don't like Sass control directives at all). Surely, you can use the loader without any other pre-processors and generate pure CSS code.

As a little example let's say you want to create some CSS classes from a JavaScript array:

**colors.css.js**
```js
const colors = ['red', 'green', 'blue'];
const rules = [];

for(const color of colors) {
  rules.push(`.bg-${color} { background-color: ${color}; }`)
}

// export resulting CSS as a string
module.exports = rules.join('\n');
```

Import the file somewhere:

```js
import './colors.css.js';
```

And as a result you're going to get a regular CSS:

```css
.bg-red { background-color: red; }
.bg-green { background-color: green; }
.bg-blue { background-color: blue; }
```

As you can see, resulting CSS string exported via `module.exports`, but with `babel-loader` you also can use ECMAScript Modules to export it.

```js
export default cssString;
// or
export const css = cssString;
```

## Usage

Step 1. Install it via `npm i -D css-dot-js-loader`

Step 2. Update your webpack config:

```js
module.exports = {
  rules: [
    {
      test: /\.css\.js$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: `css-dot-js-loader` },
      ],
    }
}
```

If you want to use it with Babel and/or PostCSS:

```js
module.exports = {
  rules: [
    {
      test: /\.css\.js$/,
      use: [
        // The order is important!
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        // PostCSS will pre-process code exported from .css.js files
        { loader: 'postcss-loader' },
        { loader: `css-dot-js-loader` },
        // Babel allows to use syntax wich isn't yet supported
        // by NodeJS version installed on your computer
        {
          loader: 'babel-loader',
          // Also transpile ECMAScript modules
          options: { presets: [['@babel/preset-env', { modules: 'commonjs' }]] }
        }
      ],
    }
}
```

Step 3. Create and import **.css.js** file (see example above).
