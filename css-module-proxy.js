/**
 * A CSS/LESS/Style module loader that prepends a proxy in non-production builds.
 *
 * The proxy checks if the loaded style module actually contains the style we are trying to fetch.
 * If it doesn't exist (its accessor returns undefined), we crash on debug (non-production) builds!
 *
 * Inspired by https://github.com/royriojas/css-local-loader
 */
module.exports = function cssLocalLoader(source, map) {
    this.cacheable();
    if (process.env.NODE_ENV !== "production") {
        const requireWrapper = `
            // If the access matches this regexp, skip it
            const oldLocals = exports.locals;
            const noMatch = /^[_]+/;
            const toJsonMatch = /^toJSON$/;
            const proxy = new Proxy(oldLocals, {
              get: function(target, name) {
                if (noMatch.test(name)) {
                    return undefined;
                }
                if (toJsonMatch.test(name)) {
                    return oldLocals.toJSON;
                }
                const clz = target[name];
                if (clz === undefined) {
                    throw new Error("Error: LESS / CSS class named \\"" + name + "\\" does not exist");
                }
                return clz;
              }
            });
            exports.locals = proxy;
        `;
        const newSource = `${source}\n\n${requireWrapper}`;
        this.callback(null, newSource, map);
    } else {
        this.callback(null, source, map);
    }
};
