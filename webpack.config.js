const path = require('path');

module.exports = {
  entry: './src/main.ts', // Your entry point
  output: {
    filename: 'main.js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output directory
    libraryTarget: 'commonjs', // Use CommonJS
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Process .ts files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node', // Target Node.js environment
  mode: 'production', // Optimize for production
};
