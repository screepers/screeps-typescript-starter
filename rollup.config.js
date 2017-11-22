"use strict";

import fs from "fs";
import path from "path";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import screepsUpload from "rollup-plugin-screeps-upload";
import typescript from "rollup-plugin-typescript2";

const getSourcemapFilename = () => 'main.js.map.js'

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
    onwrite: function ({ bundle }) {
      const map = bundle.map
      fs.writeFileSync(path.resolve(__dirname, `./dist/${options || getSourcemapFilename()}`), map);
      // Delete the old file
      fs.unlinkSync(path.resolve(__dirname, `./dist/main.js.map`));
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
    exportSourceMaps("main.js.map.js"),
    screepsUpload("./screeps.json")
  ]
}
