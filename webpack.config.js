var webpack = require('webpack'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    Dashboard = require('webpack-dashboard'),
    DashboardPlgin = require('webpack-dashboard/plugin'),
    WebpackDevServer = require('webpack-dev-server'),
    CleacPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path');

var dashboard = new Dashboard();

process.env.ENV = process.env.ENV || 'dev';
process.env.PROT = process.env.PROT || '3002';

module.exports = {
    entry: {
        app: path.join(__dirname, './src/app/app')
    },
    output: {
        path: path.join(__dirname, 'dist', process.env.ENV),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel-loader',
                exclude: 'node_modules'
            },
            {
                test: /\.scss$/,
                include: path.join(__dirname, './src'),
                loader: ExtractTextPlugin.extract([
                    'css',
                    'postcss',
                    'sass?config=sassConfig'
                ])
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract([
                    'css'
                ])
            }
        ]
    },

    postcss: function() {
        return [
            require('autoprefixer')({
                browsers: ['> 5%']
            }),
            require('postcss-assets')({
                relative: true,
                loadPaths: ['./images']
            }),
            require('postcss-at2x')()
        ]
    },

    sassConfig: {
        includePaths: [
            path.resolve('./src/sass'),
            require('bourbon').includePaths,
            path.join(__dirname, './node_modules')
        ]
    },

    resolve: {
        extensions: ['', '.js', '.es6']
    },

    plugins: [
        // 注入html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),

        new CleacPlugin(['dist']),

        new webpack.HotModuleReplacementPlugin(),

        new OpenBrowserPlugin({
            url: `http://localhost:${process.env.PROT}/`
        }),

        new DashboardPlgin(dashboard.setData),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons'
        }),

        new ExtractTextPlugin('./styles/[name].[contenthash:8].css')
    ]
}

module.exports.devServer = {
    port: process.env.PROT,
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    publicPath: '',
    stats: {
        color: true
    }
};
