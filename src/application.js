const http = require('http')
let EventEmitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa extends EventEmitter {
    constructor() {
        super()
        this.fn
        this.context = context // 将三个模块保存，全局的放到实例上
        this.response = response
        this.request = request
    }
    use(fn) {
        this.fn = fn
    }
    createContext(req, res) {
        const ctx = Object.create(this.context)
        // 使用Object.create方法是为了继承this.context但在增加属性时不影响原对象
        const request = ctx.request = Object.create(this.request)
        const response = ctx.response = Object.create(this.response)
        // 将req,res对象绑定，随时便于读取
        ctx.res = request.res = response.res = res
        ctx.req = request.req = request.req = req
        request.ctx = response.ctx = ctx
        request.response = response
        response.request = request
        return ctx
    }
    handleRequest(req, res) { //创建一个处理请求函数
        let ctx = this.createContext(req, res)
        this.fn(ctx)
        res.end(ctx.body) //ctx.body输出到前台的数据
    }
    listen() {
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arguments)
    }
}

module.exports = Koa