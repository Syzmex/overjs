
// eslint-disable-next-line
import { paths, getEntry, getOutput, getSVGRules, loaders, plugins, combine } from 'kiwiai';

const { styleLoader, cssLoader, postcssLoader, lessLoader, urlLoader,
  babelLoader, jsonLoader, getDefaultLoaderOptions } = loaders;

const cssOptions = {
  importLoaders: 1
};

const babelOptions = getDefaultLoaderOptions( 'babel' );
babelOptions.plugins.push( 'transform-class-properties' );
babelOptions.plugins.push( 'transform-decorators-legacy' );
babelOptions.plugins.push([ 'transform-es2015-modules-commonjs', { loose: true }]);
babelOptions.plugins.push( 'transform-es3-member-expression-literals' );
babelOptions.plugins.push( 'transform-es3-property-literals' );

const srcInclude = [
  paths.appSrc,
  paths.resolveApp( 'examples' )
];

export default {
  devtool: 'cheap-module-source-map',
  entry: getEntry(['./examples/index.js']),
  output: getOutput(),
  resolve: {
    modules: [
      paths.ownNodeModules,
      paths.appNodeModules
    ],
    extensions: [ '.js', '.json' ]
  },
  module: {
    rules: [{
      exclude: [
        /\.html$/,
        /\.js$/,
        /\.(css|less)$/,
        /\.json$/,
        /\.svg$/
      ],
      use: [urlLoader()]
    }, {
      test: /\.js$/,
      include: srcInclude,
      use: [babelLoader( babelOptions )]
    }, {
      test: /\.css$/,
      include: srcInclude,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader()
      ]
    }, {
      test: /\.less$/,
      include: srcInclude,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader(),
        lessLoader()
      ]
    }, {
      test: /\.css$/,
      include: paths.appNodeModules,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader()
      ]
    }, {
      test: /\.less$/,
      include: paths.appNodeModules,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader(),
        lessLoader()
      ]
    }, {
      test: /\.json$/,
      use: [jsonLoader()]
    }]
  },
  plugins: combine(
    plugins.Define(),
    plugins.HotModuleReplacement(),
    plugins.CaseSensitivePaths(),
    plugins.WatchMissingNodeModules(),
    plugins.SystemBellWebpack(),
    plugins.CopyPublic(),
    plugins.CommonsChunk(),
    plugins.HtmlWebpack({
      favicon: ''
    })
  ),
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
