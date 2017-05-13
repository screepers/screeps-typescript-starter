const ConcatSource = require('webpack-sources').ConcatSource;
const path = require('path');

// Tiny tiny helper plugin that prepends "module.exports = " to all `.map` assets

class ScreepsSourceMapToJson {
  constructor(options) {
    return;
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, cb) => {
      for (var filename in compilation.assets) {
        if (path.extname(filename) === ".map") {
          compilation.assets[filename] = new ConcatSource("module.exports = ", compilation.assets[filename]);
        }
      }
      cb();
    });
  }
}

module.exports = ScreepsSourceMapToJson;
