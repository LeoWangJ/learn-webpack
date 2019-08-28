# 前端webpack建置環境

此專案主要來學習配置各種前端使用到的各種檔案格式,順便記錄起來,方便之後查閱。

### loaders

1. [編譯高版本的JS](#編譯高版本的JS)
2. [在js中編譯scss,並使css有兼容性](#在js中編譯scss並使css有兼容性)
3. [各種圖片檔進行壓縮或使用base64](#載入各種圖片檔以及進行壓縮或使用base64)

### 開發細節處理

1. [複製不需打包的檔案至dist資料夾中](#複製不需打包的檔案至dist資料夾中)
2. [全局使用jQuery](#全局使用jQuery)
3. [使用html的template並且自動注入js檔](#使用html的template並且自動注入js檔)
4. [排除loader不需編譯的路徑](#排除loader不需編譯的路徑)
5. [將node_module裡的套件打包至vendor.js](#將node_module裡的套件打包至vendor.js)

### 建置前端框架環境

1. [vue框架環境](#vue框架環境)


# 介紹

### 編譯高版本的JS

我們使用babel來編譯一些高版本的JS,例如:ES6,ES7等...  
先讓我們安裝babel套件

> npm i @babel/core @babel/preset-env babel-loader -D

接著在js module部分新增babel-loader
```js
{
    test: /\.js$/,
    use:['babel-loader'],
},
```

在babel編譯讀取時,會依照設定檔.babelrc裡面的設定進行編譯,下面的presets設定是指要使用哪種語言特性,我這邊是選擇目前所有ES標準裡的最新特性。

```js
{
    "presets": ["@babel/preset-env"]
}
```

可以至[babel官網](https://babeljs.io/docs/en/presets?target="_blank")查看presets的各種設定。

### 在js中編譯scss並使css有兼容性

##### 1. 在js中編譯scss
我們需要安裝在node環境下能夠編譯scss的套件以及將scss轉成css的套件

> npm i -D node-sass sass-loader

轉成css後我們還需要安裝css-loader來將css程式中的@import和url()的匯入敘述,告訴webpack依賴這些資源。  
接著再使用style-loader將css程式轉換成字串,植入JS程式中,透過JS在DOM增加樣式。  
當然我們也可以使用ExtractTextPlugin將css檔案獨立出來,這個我們稍後再來說明。

> npm i -D css-loader style-loader

```js
{
    test: /\.(scss|sass)$/,
    use:[
        'style-loader',
        'css-loader',
        'sass-loader'
    ]
}
```

在webpack loaders中的use執行順序是由最後面執行到最前面,也就是sass-loader最先開始執行。

##### 2. 使css有兼容性
有一些css在某些瀏覽器可能沒有支援,那我們要怎麼讓瀏覽器保持相容性呢？   
我們需要添加字首-webkit -ms..等等, 但添加這些字首是非常費時的。  
所幸有一個工具能夠幫我們解決這問題,甚至可以用css最新的語法,那就是PostCSS !  

使用PostCSS時,我們必須先建立一個設定檔postcss.config.js

```js
//postcss.config.js
module.exports = {
    plugins:[
        require('autoprefixer')
    ]
}
// package.json 物件添加,代表所要兼容的瀏覽器資訊
"browserslist": [
    "last 5 version",
    "> 1%",
    "ie >= 10",
    "ios >= 8"
  ]
```
上面我使用了自動添加瀏覽器兼容的字首之後,我們需要在上面的loader新增postcss-loader
```js
{
    test: /\.(scss|sass)$/,
    use:[
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
    ]
}
```
postcss-loader必須在css-loader解析之前執行,否則會無效。

### 載入各種圖片檔以及進行壓縮或使用base64

##### 1. 載入各種圖片檔
在網站中我們總是無法避免會使用圖檔的部分。  
那在css或js中引入圖檔時,我們要怎麼去讓webpack載入資源呢？  
使用file-loader就能夠解決這個問題

> npm i -D file-loader

```js
{
    test: /\.(png|svg|jpg)$/,
    use:[
        {
            loader:'file-loader',
            options:{
                name: '[path][name].[ext]?[hash:8]'
            }
        }
    ]
}
```

##### 2. 進行壓縮或使用base64
載入圖片我們也可以使用url-loader去進行加載,若圖片體積不大則我們可以進行base64編碼來載入圖片。  
優點是可以減少請求但若圖片體積過大使得編碼過大的話,則在打包時會使js檔變得太大,可能會導致加載時間更長。  
所以通常我們會設置limit來判斷是否要進行base64編碼轉換,若沒有進行base64的圖片則是經過file-loader去載入資源。

> npm i -D url-loader
```js
{
    test:/\.(png|svg|jpg)$/,
    use:[
        {
            loader:'url-loader',
            options:{
                limit:50000,
                name:'[path][name].[ext]?[hash:8]'
            }
        },
    ]
}
```

那怎麼進行圖片壓縮呢？  
我們使用image-webpack-loader這個來進行壓縮

> npm i -D image-webpack-loader

一樣在剛剛的use中使用,我們會先對圖片進行壓縮,才會去判斷是否要將圖片轉成base64
```js
{
    test:/\.(png|svg|jpg)$/,
    use:[
        {
            loader:'url-loader',
            options:{
                limit:50000,
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
    ]
}
```
上面所設定的壓縮部分可以參考image-webpack-loader的[npm](https://www.npmjs.com/package/image-webpack-loader?target="_blank),在這就不進行詳細說明。

### 複製不需打包的檔案至dist資料夾中
我們在開發時有時會有一些檔案是不需要經過loader就能夠使用的，我們所需要做的就是將該檔案移至打包後的檔案就可，那我們需要怎麼做呢？  
CopyWebpackPlugin可以解決我們這個需求  

> npm i -D copy-webpack-plugin

安裝後我們來看要怎麼使用

```js
var CopyWebpackPlugin = require('copy-webpack-plugin')

plugins:[
    new CopyWebpackPlugin([
        {from : 'assets', to: 'assets' } 
    ])
]
```

首先我們必須先載入額外的CopyWebpackPlugin模組，接著在webpack.config.js中的plugins添加該模組。  
在CopyWebpackPlugin中我們定義了 {from : 'assets', to: 'assets' } 這個物件，該物件的意思是我們從開發中的assets資料夾移至打包後的assets資料夾，這樣就完成了我們複製資料的功能了。  

### 全局使用jQuery
雖然現代開發網頁已經很少使用jQuery了，我們在這邊使用jQuery只是做為一個範例，你可以透過該種方式去引入你想要的套件。  
但不太推薦將套件引入至全域，因為可能會有不避要的衝突，除非真的有需要。  
我們透過webpack原本就提供的ProvidePlugin來實現全域引入的方式。  
首先先下載jQeury

> npm i --save jquery

接著引入ProvidePlugin模組
```js
 var webpack = require('webpack')

 plugins:[
     new webpack.ProvidePlugin({
         $: 'jquery',
         jQuery: 'jquery',
         'Window.jQuery': 'jquery'
     })
 ]

 // index.js
 $('#test').text('hello')
```

我們在ProvidePlugin中定義了$,jQuery,Window.jQuery,這三個名稱，指的是我們可以在全域中使用這三個名稱來呼叫jquery。  
此時你可以在自己的js檔中使用jQuery而不用再使用import方式去載入。  

### 使用html的template並且自動注入js檔
假如你的專案是使用多頁面的方式來進行開發，這樣可能有遇過一個問題就是有共用的JS檔時或者meta,title之類的名稱時，你都要手動去添加在各個html上，但webpack有提供一個套件能夠讓我們解決這個問題並且將打包後的JS可以自動注入JS當中。  

> npm i -D webpack-html-plugin

```js
var HtmlWebpackPlugin = require('html-webpack-plugin');

plugins:[
    new HtmlWebpackPlugin({
        title: 'webpack練習',
        filename: 'index.html',
        template:'html/index.html',
        chunks:['index']
    }),
]
```
首先必須先引用html-webpack-plugin這個套件並在plugins中使用。  
我們添加了幾個參數:  
1. title : 提供html使用的動態變數
2. filename: 我們輸出後的檔案名稱
3. template: 我們要套用的html
4. chunks: 動態添加的JS檔

接著來看我們要套用的html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%=htmlWebpackPlugin.options.title%></title>

</head>
<body>
    <div id="app"></div>
</body>
</html>
```
<%=htmlWebpackPlugin.options.title%>就是對應到我們在plugins有使用到的title參數，另一個要注意的點就是我們在這邊並未手動輸入打包後的JS檔。  

### 排除loader不需編譯的路徑

### 將node_module裡的套件打包至vendor.js

### vue框架環境