# 前端webpack建置環境

此專案主要來學習配置各種前端使用到的各種檔案格式,順便記錄起來,方便之後查閱。

### loaders

1. [編譯高版本的JS](#編譯高版本的JS)
2. [在js中編譯scss,並使css有兼容性](#在js中編譯scss並使css有兼容性)
3. 各種圖片檔進行壓縮或使用base64

### 開發細節處理

1. 複製不需打包的檔案至dist資料夾中
2. 全局使用jQuery
3. 使用html template並且自動注入js檔
4. 排除loader不需編譯的路徑
5. 將node_module裡的套件打包至vendor.js

### 建置前端框架環境

1. vue框架環境


# 介紹

#### 編譯高版本的JS

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

#### 在js中編譯scss並使css有兼容性

##### 1. 在js中編譯scss
我們需要安裝在node環境下能夠編譯scss的套件以及將scss轉成css的套件

> npm i -D node-sass sass-loader

轉成css後我們還需要安裝css-loader來將css程式中的@import和url()的匯入敘述,告訴webpack依賴這些資源。
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

#### 各種圖片檔進行壓縮或使用base64

