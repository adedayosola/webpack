const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'ui'),
  build: path.join(__dirname, 'build')
};

const commonConfig = merge([
  {
  entry: {
    public: path.join(PATHS.app, 'public.js'),
    luxe: path.join(PATHS.app, 'luxe.js'),
    // vendor=[]
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },

  },
//   parts.extractBundles([
//     {
//       names:['vendors',],
//        minChunks: ({ resource }) => (
//        resource &&
//        resource.indexOf('node_modules') >= 0 &&
//        resource.match(/\.js$/)
//        ),
//     },
//     {
//       name: 'manifest',
//       minChunks: Infinity,
//     },

//   ]),
  // parts.lintJavaScript({  include: PATHS.app }),
  // parts.lintCSS({ include: PATHS.app }),
  parts.loadJavaScript({ include:PATHS.app }),
]);

const productionConfig = merge([
  {
    performance:{
      hints:'warning',
      maxEntrypointSize: 100000,
      maxAssetSize: 450000,
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
    //   publicPath: '/',
    },
    plugins:[
      new webpack.HashedModuleIdsPlugin(),

    new CopyWebpackPlugin([{
      from: path.join(PATHS.app, '/images/'),
      to: path.join(PATHS.build),
    },
    {
        from:path.join(PATHS.app, '/fonts/'),
        to:path.join(PATHS.build),
    }
    ]),
    ],
    // recordsPath: 'records.json',
  },
  parts.clean(PATHS.build),
  parts.minifyJavascript({ useSourceMap: true }),
  parts.minifyCSS({
    options:{
      discardComments: {
        removeAll: true,
      },
      safe:true,
    },
  }),
//   parts.attachRevision(),
  parts.extractCSS({
    use:['css-loader', parts.autoprefix()],
  }),
  parts.extractSCSS({
    use:['css-loader', 'sass-loader'],
  }),
  parts.generateSourceMaps({type: 'source-map'}),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
  parts.compressAssets(),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack://[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map'}),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadSASS(),
  ]);

module.exports = (env) => {

  if (env == 'production'){
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};