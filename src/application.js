const http = require('http')
let EventEmitter = require('events')
let Stream = require('stream') // 引入stream
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa extends EventEmitter {
    constructor() {
        super()
        this.middlewares = []
        this.context = context // 将三个模块保存，全局的放到实例上
        this.response = response
        this.request = request
    }
    use(fn) {
        this.middlewares.push(fn) 
    }
    compose(middlewares, ctx) {
        function dispatch(index) {
            if(index === middlewares.length) {
                return
            }
            let middleware = middlewares[index]
            middleware(ctx, ()=> dispatch(index+1)) //递归处理中间件 调用next时，会执行下一个中间件
        }
        dispatch(0)
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
        res.statusCode = 404 //默认404
        let ctx = this.createContext(req, res)
        // this.fn(ctx)
        this.compose(this.middlewares, ctx)
        //ctx.body输出到前台的数据
        if(typeof ctx.body === 'object') {
            res.setHeader('Content-Type', 'application/json;charset=utf8')
            res.end(JSON.stringify(ctx.body))
        } else if(ctx.body instanceof Stream) { // 流输入时
            ctx.body.pipe(res)
        } else if(typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) { // 
            res.setHeader('Content-Type', 'text/htmlcharset=utf8')
            res.end(ctx.body)
        } else {
            res.end('not found') 
        }
    }
    listen() {
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arguments)
    }
}

module.exports = Koa