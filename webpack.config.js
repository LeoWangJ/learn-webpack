let path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('css/[name].css');
const extractSCSS = new ExtractTextPlugin('scss/[name].scss');
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
       index: './js/index.js',
       about: './js/about.js',
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename:'js/[name].js'
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
                use:extractSCSS.extract([
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ])
            }
        ]
    },
    plugins:[
        extractCSS,
        extractSCSS
    ],
    devServer:{
        compress:true,
        port:3000,
        stats:{
            cached:false
        }
    }
}