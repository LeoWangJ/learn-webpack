let path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('css/[name].css');
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
       index: 'index',
       about: 'about',
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename:'js/[name].js'
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
                test: /\.html$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        name: '[path][name].[ext]'
                    }
                }]
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader','postcss-loader'])
            },
            {
                test: /\.(sass|scss)$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                use:['babel-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 50000,
                      name:'[path][name].[ext]?[hash:8]'
                    },
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
                ]
            },
        ]
    },
    plugins:[
        extractCSS
    ],
    devServer:{
        compress:true,
        port:3000,
        stats:{
            cached:false
        }
    }
}