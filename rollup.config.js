import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "ui/index.js",
  output: {
    file: "grooming.bin.js",
    format: "iife"
  },
  plugins: [
    svelte({
      // By default, all .svelte and .html files are compiled
      //   extensions: ['.my-custom-extension'],
      // You can restrict which files are compiled
      // using `include` and `exclude`
      //   include: 'src/components/**/*.svelte',
      // By default, the client-side compiler is used. You
      // can also use the server-side rendering compiler
      //   generate: 'ssr',
      // Optionally, preprocess components with svelte.preprocess:
      // https://svelte.dev/docs#svelte_preprocess
      //   preprocess: {
      //     style: ({ content }) => {
      //       return transformStyles(content);
      //     }
      //   },
      // Emit CSS as "files" for other plugins to process
      //   emitCss: true,
      // Extract CSS into a separate file (recommended).
      // See note below
      //   css: function (css) {
      //     console.log(css.code); // the concatenated CSS
      //     console.log(css.map); // a sourcemap
      //     // creates `main.css` and `main.css.map` — pass `false`
      //     // as the second argument if you don't want the sourcemap
      //     css.write('public/main.css');
      //   },
      // Warnings are normally passed straight to Rollup. You can
      // optionally handle them here, for example to squelch
      // warnings with a particular code
      //   onwarn: (warning, handler) => {
      //     // e.g. don't warn on <marquee> elements, cos they're cool
      //     if (warning.code === 'a11y-distracting-elements') return;
      //     // let Rollup handle all other warnings normally
      //     handler(warning);
      //   }
    }),
    resolve(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      // include: 'node_modules/**',  // Default: undefined
      // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/
      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
      // if true then uses of `global` won't be dealt with by this plugin
      // ignoreGlobal: false,  // Default: false
      // if false then skip sourceMap generation for CommonJS modules
      // sourceMap: false,  // Default: true
      // explicitly specify unresolvable named exports
      // (see below for more details)
      // namedExports: { 'react': ['createElement', 'Component' ] },  // Default: undefined
      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      // ignore: [ 'conditional-runtime-dependency' ]
    })
  ]
};
