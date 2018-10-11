const Koa = require('./src/application')

const app = new Koa()
app.use((ctx) => {
    ctx.res.end('hello world')
})
app.listen('3306', (err)=>{
    console.log("服务器已经开启", `http://localhost:3306`)
})