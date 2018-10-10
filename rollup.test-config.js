"use strict";

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import buble      from 'rollup-plugin-buble';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'test/**/*.test.ts',
  output: {
    file: 'dist/test.bundle.js',
    name: 'lib',
    sourcemap: true,
    format: 'iife',
    globals: {
      chai: 'chai',
      it: 'it',
      describe: 'describe'
    }
  },
  external: ['chai', 'it', 'describe'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    multiEntry(),
    buble()
  ]
}
