var path = require('path')
const { ModuleFederationPlugin } = require('webpack').container
const httpNode = require('./webpack/http-node')

var serverConfig = {
  target: httpNode,
  entry: path.resolve(process.cwd(), 'src', 'noop.js'),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath:
      'https://api.github.com?owner=module-federation&repo=aegis-registry&filedir=dist&branch=main',
    libraryTarget: 'commonjs'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.py$/,
        use: [{ loader: 'python-webpack-loader' }]
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async'
      }
    ]
  },
  experiments: {
    asyncWebAssembly: true
  },
  optimization: {
    chunkIds: 'deterministic' // To keep filename consistent between different modes (for example building only)
  },
  module: {
    rules: [
      {
        test: /\.py$/,
        loader: 'py-loader',
        options: {
          compiler: 'transcrypt'
        }
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteRegistry',
      library: { type: 'commonjs-module' },
      filename: 'remoteEntry.js',
      exposes: {
        './default': './default/remote-entries'
        // './order': './order/remote-entries',
        // './payment': './payment/remote-entries',
        // './shipping': './shipping/remote-entries',
        // './activation-01': './activation-01/remote-entries',
        // './multicast-grp-02': './multicast-grp-02/remote-entries',
        // './bldg-01': './bldg-01/remote-entries'
      }
    })
  ]
}

module.exports = [serverConfig]
