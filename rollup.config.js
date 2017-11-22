"use strict";

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import screepsUpload from "rollup-plugin-screeps-upload";
import typescript from "rollup-plugin-typescript2";

// In Screeps, require only works for exported content
// This "plugin" prepends an export to source maps so that it can be loaded in screeps via require`
function exportSourceMaps() {
  return {
    name: "export-source-maps",
    ongenerate: function (options, bundle) {
      let tmp = bundle.map.toString;

      delete bundle.map.sourcesContent;

      bundle.map.toString = function () {
        return "module.exports = " + tmp.apply(this, arguments) + ";";
      }
    }
  }
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs"
  },

  sourcemap: true,

  plugins: [
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    exportSourceMaps(),
    screepsUpload('./screeps.json')
  ]
}
