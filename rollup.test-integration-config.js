"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import buble      from 'rollup-plugin-buble';
import multiEntry from '@rollup/plugin-multi-entry';
import nodent from 'rollup-plugin-nodent';

export default {
  input: 'test/integration/**/*.test.ts',
  output: {
    file: 'dist/test-integration.bundle.js',
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
    typescript({tsconfig: "./tsconfig.test-integration.json"}),
    nodent(),
    multiEntry(),
    buble()
  ]
}
