"use strict";

import fs from "fs";
import path from "path";
import clean from "rollup-plugin-clean";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import screepsUpload from "rollup-plugin-screeps-upload";
import typescript from "rollup-plugin-typescript2";

// In Screeps, require only works for exported content
// This "plugin" prepends an export to source maps so that it can be loaded in screeps via require`
function exportSourceMaps(options) {
  return {
    name: "export-source-maps",
    ongenerate: function (options, bundle) {
      let tmp = bundle.map.toString;

      delete bundle.map.sourcesContent;

      bundle.map.toString = function () {
        return "module.exports = " + tmp.apply(this, arguments) + ";";
      }
    },
    onwrite: function () {
      // Rename generated source file
      fs.renameSync(
        path.resolve(__dirname, "./dist", "main.js.map"),
        path.resolve(__dirname, "./dist", options.filename || "main.js.map.js")
      );
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
    clean(),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    exportSourceMaps({filename: "./main.js.map.js"}),
    screepsUpload("./screeps.json")
  ]
}
