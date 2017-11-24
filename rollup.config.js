"use strict";

import clean from "rollup-plugin-clean";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import screeps from "rollup-plugin-screeps";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs"
  },

  sourcemap: true,

  plugins: [
    clean(),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps({configFile: "./screeps.json"})
  ]
}
