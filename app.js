const Koa = require('./src/application')

const app = new Koa()
app.use((ctx, next) => {
    console.log(1)
    next()
    console.log(2)
})
app.use((ctx, next) => {
    console.log(3)
    next()
    console.log(4)
})
app.use((ctx, next) => {
    console.log(5)
    next()
    ctx.body = "11"
})

app.listen('3306', (err)=>{
    console.log("服务器已经开启", `http://localhost:3306`)
})