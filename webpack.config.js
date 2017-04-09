'use strict';

const path = require('path');
const webpack = require('webpack');

function webpackConfig(env) {

  let root = __dirname;
  let pkgName = 'GulpSassPedigree';
  let {
    name, homepage, description, main,
    license, version, keywords, author
  } = require('./package.json');

  const header = `/**!
 ** @name ${name}
 ** @version ${version}
 ** @author ${author}
 ** @url ${homepage}
 ** @description ${description}
 ** @keywords [${keywords.join(', ')}]
 ** @entry ${main}
 ** @license ${license}
***/
`;

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
    plugins: [
      new webpack.BannerPlugin({
        banner: header,
        raw: true
      })
    ],
    externals: [
      require('webpack-node-externals')()
    ]
  };
}

module.exports = webpackConfig;
