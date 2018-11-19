const Koa = require('koa');
const config = require('./config');
const app = new Koa();

let Connection = require('./mysql_conn');

//middleWare1
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log('${ctx.method} ${ctx.url}-${rt}');
    console.log('调用中间件1');
});
//middleWare2
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    console.log('调用中间件2');
});

app.use(async ctx => {
    let conn = new Connection();
    let result = await conn.query(`insert into user values (0, 'ceshi', 22, '19930202')`);
    console.log(result);
    ctx.body = result;
    console.log('调用中间件3');
});

app.listen(8080);
