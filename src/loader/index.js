
module.exports = function (source, map) {
    console.log(source)
    return require('./trans-cn.js')(source)
}