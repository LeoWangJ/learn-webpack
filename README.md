# 前端webpack建置環境

此專案主要來學習配置各種前端使用到的各種檔案格式,順便記錄起來,方便之後查閱。

### loaders

1. [編譯高版本的JS](#編譯高版本的JS)
2. [在js中編譯scss,並使css有兼容性](#在js中編譯scss,並使css有兼容性)
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

#### 在js中編譯scss,並使css有兼容性