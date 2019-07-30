let path = require('path')

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
                use:['style-loader','css-loader']
            }
        ]
    }

}