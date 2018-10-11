let proto = {} // proto同源码定义的变量名
function defineGetter(prop, name) { // 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性
    proto.__defineGetter__(name, function() {
        return this[prop][name]
    })
}

defineGetter('request', 'url')
defineGetter('request', 'path')

function defineSetter(prop, name) {
    proto.__defineSetter__(name, function(value) {
        this[prop][name] = value
    })
}
defineGetter('response', 'body') // 同样代理response的body属性
defineSetter('response', 'body') // 同理

module.exports = proto