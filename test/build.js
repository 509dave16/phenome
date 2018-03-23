const rollup = require('rollup');
const rollupBuble = require('rollup-plugin-buble');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonJs = require('rollup-plugin-commonjs');
const rollupReplace = require('rollup-plugin-replace');

const compile = require('../src/compiler-io/');

const buildComponentLibrary = async () => {
  await compile({
    paths: ['./component-library/src/**/*.js'],
    vue: {
      out: './component-library/dist/vue/'
    },
    react: {
      out: './component-library/dist/react/'
    }
  });
};

let cache;

const buildApp = async library => {
  const inputOptions = {
    input: `./test/app/${library}/src/app.js`,
    cache,
    plugins: [
      rollupResolve({ jsnext: true, browser: true }),
          rollupCommonJs(),
          rollupReplace({
          delimiters: ['', ''],
          'process.env.NODE_ENV': JSON.stringify('development'), // or 'production'
      }),
      rollupBuble(),
    ],
  };

  const outputOptions = {
    format: 'iife',
    file: `./test/app/${library}/dist/app.js`,
    name: 'app',
    strict: true,
    sourcemap: false,
  };

  const buildBundle = async () => {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // generate code and a sourcemap
    const { code, map } = await bundle.generate(outputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
  }

  await buildBundle();
};

const buildAll = async () => {
  await buildComponentLibrary();
  await [
    await buildApp('vue'),
    await buildApp('react')
  ];
};

buildAll();