
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'mmir-plugin-speech-nuance-lang': './res/web-dist.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'amd'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { configFile : path.resolve(__dirname, 'tsconfig-dist.json') }
      }
    ]
  }
};
