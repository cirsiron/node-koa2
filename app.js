const Koa = require('./src/application')

const app = new Koa()
app.use((crx, next) => {
    console.log(1)
    next()
    console.log(2)
})
app.use((crx, next) => {
    console.log(3)
    next()
    console.log(4)
})
app.use((crx, next) => {
    console.log(5)
    next()
    console.log(6)
})

app.listen('3306', (err)=>{
    console.log("服务器已经开启", `http://localhost:3306`)
})