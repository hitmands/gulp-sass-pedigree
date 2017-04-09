'use strict';

const path = require('path');

function webpackConfig(env) {

  let root = __dirname;
  let pkgName = 'GulpSassPedigree';

  return {
    target: 'node',
    devtool: 'source-map',
    entry: {
      [pkgName]: [`./src/${pkgName}.js`]
    },
    output: {
      libraryTarget: "commonjs-module",
      path: path.join(root, 'build'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      ]
    },
    externals: [
      require('webpack-node-externals')()
    ]
  };
}

module.exports = webpackConfig;
