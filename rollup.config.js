const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const builtins = require('builtin-modules');
const replace = require('rollup-plugin-replace');

export default {
  external: [ ...builtins, 'aws-sdk', 'pg-native' ],
  input: 'testFunction.ts',
  plugins: [
    replace({ 'pg-native': 'fs' }),
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    json(),
    typescript({
      allowSyntheticDefaultImports: true,
      lib: [ 'es2019' ],
      outputToFilesystem: true,
      target: 'es6',
      tsconfig: false,
      typescript: require('typescript'),
    }),
  ],
  output: {
    file: 'dist/testFunction.js',
    format: 'commonjs',
  }
}
