let path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('css/[name].css');
module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
       index: './js/index.js',
       about: './js/about.js',
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename:'[name].bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader','postcss-loader'])
            }
        ]
    },
    plugins:[
        extractCSS
    ]

}