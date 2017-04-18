const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CompresionPlugin = require('compression-webpack-plugin');


exports.devServer = ({ host, port} = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: false,
    },
  },
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
  module : {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'eslint-loader',
        options,
      },
    ],
  },
});

exports.loadCSS = ({ include, exclude, use } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: [
          'style-loader',
        {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]-[local]-[hash:base64:6]'
        },
        },
      ],
      },
    ],
  },
});

exports.loadSASS = ({ include, exclude, use } = {}) => ({
  module: {
    rules:[
      {
        test: /\.scss$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});


exports.extractCSS = ({ include, exclude, use }) => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
  });

  return {
    module: {
      rules:[
        {
          test: /\.css$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [ plugin ],
  };
};

exports.extractSCSS = ({ include, exclude, use }) => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
  });

  return {
    module: {
      rules:[
        {
          test: /\.scss$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [ plugin ],
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer'),
    ]),
  },
});


exports.purifyCSS = ({ paths, purifyOptions }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths,
      purifyOptions,
       }),
  ],
});



exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'postcss-loader',
        options: {
          plugins: () => ([
            require('stylelint')({
              ignoreFiles: 'node_modules/**/*.css',
            }),
          ]),
        },
      },
    ],
  },
});


exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,

        loader: 'babel-loader',
        options: {
          cacheDirectory:true,
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.clean = (path) => ({
  plugins: [
    new CleanWebpackPlugin([path]),
  ],
});

// exports.attachRevision = () => ({
//   plugins: [
//     new webpack.BannerPlugin({
//       banner: new GitRevisionPlugin().version(),
//     }),
//   ],
// });

exports.minifyJavascript = () => ({
  plugins:[
    new BabiliPlugin(),
  ],
});

exports.minifyCSS = ({ options }) => ({
  plugins:[
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint:false,
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins:[
      new webpack.DefinePlugin(env),
    ],
  };
};

exports.compressAssets = () => ({
  plugins:[
    new CompresionPlugin(
      {
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$|\.css$/,
        threshold:10240,
        minRatio:0.8,
      }),
  ],
});

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});