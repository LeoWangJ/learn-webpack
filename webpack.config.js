let path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name].css');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
       index: 'index',
       about: 'about',
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename:'js/[name].js?[hash:8]'
    },
    optimization:{
        splitChunks:{
            cacheGroups: {
                vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendeor',
                  chunks:'initial',
                  enforce:true
                }
            }
        }
    },
    resolve:{
        modules:[
            path.resolve('src'),
            path.resolve('src/js'),
            path.resolve('src/scss'),
            path.resolve('src/img'),
            path.resolve('node_modules')
        ],
        extensions:['.js']
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader','postcss-loader']),
                include: path.resolve('src/css'),
                exclude: path.resolve('node_modules')
            },
            {
                test: /\.(sass|scss)$/,
                use:[
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                use:['babel-loader'],
                include: path.resolve('.')
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 50000,
                      name:'[path][name].[ext]?[hash:8]'
                    }
                  },
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: {
                        progressive: true,
                        quality: 65
                      },
                      // optipng.enabled: false will disable optipng
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: '65-90',
                        speed: 4
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                      // the webp option will enable WEBP
                      webp: {
                        quality: 75
                      }
                    }
                  }
                ],
                include: path.resolve('src/img'),
                exclude: path.resolve('node_modules')
            },
        ]
    },
    plugins:[
        extractCSS,
        new CopyPlugin([
            { from: 'assets', to: 'assets' },
        ]),
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery:'jquery',
            'window.jQuery':'jquery'
        }),
        new HtmlWebpackPlugin({
            title: 'webpack練習',
            filename: 'index.html',
            template:'html/index.html',
            chunks:['vendeor','index']
        }),
        new VueLoaderPlugin()
    ],
    devServer:{
        compress:true,
        port:3000,
        stats:{
            cached:false
        }
    }
}