"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import buble      from 'rollup-plugin-buble';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'test/unit/**/*.test.ts',
  output: {
    file: 'dist/test-unit.bundle.js',
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
    clear({ targets: ["dist/test.bundle.js"] }),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    multiEntry(),
    buble()
  ]
}
