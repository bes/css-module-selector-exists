# CSS Module Selector Exists?

## What is this?

A Webpack loader that can be used to append a proxy to your CSS/LESS/Style
modules, and throw a `new Error` if the browser tries to use an undefined
CSS selector.

In other words, your JavaScript runtime will crash when trying to use a CSS
class that doesn't exist in your CSS/LESS/Style module.

## Caveats / Known issues

* You can not use a CSS selector named `default` because that is a reserved
  name in JavaScript and will resolve to a `Symbol` at runtime, and won't work.
* You can not use this library with "Empty" selectors, they are not added to
  the module output. Fill them up with nonsense, e.g. `color: inherit` if you
  must have them.
* Probably slows down rendering by some small amount of time per CSS className
  access.
* Surely, there are other bugs, please report them.

EXAMPLE

```css
/* DO NOT USE THE CLASS NAME .default, it will not work! */
.default {
    display: none;
}

/* DO NOT USE AN EMPTY SELECTOR */
.emptySelector {
    /* PLEASE DON'T */
}

/* PLEASE USE A NONSENSE SELECTOR INSTEAD, as a placeholder for future styles */
.nonsensePlaceholder {
    color: inherit;
}
```

## Is it published to npm?

I hate npm.

Just follow the instructions and include this code in your repository.
If it stops working, file an issue.

## Instructions for use

Place the file `css-module-proxy.js` anywhere in your Webpack project,
I recommend `/webpack/loaders/css-module-proxy.js`, but you can use whatever
path you like.

Then add the loader ABOVE any other loaders, so that it is placed last in the
loader evaluation chain.

Here is an example for a LESS loader:
```
{
    test: /\.module\.less$/,
    use: [
        { loader: path.resolve("webpack/loaders/css-module-proxy.js") },
        {
            loader: "css-loader",
            options: {
                modules: true,
                importLoaders: 1,
                localIdentName: "[name]__[local]__[hash:base64:5]",
            },
        },
        { loader: "less-loader" },
    ],
},
```

# Compatibility

Tested with Webpack 4.
