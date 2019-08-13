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
                use:extractCSS.extract([
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ])
            },
            {
                test: /\.js$/,
                use:['babel-loader']
            }
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