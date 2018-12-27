const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    // console.log(1);
    await next();
    // console.log(6)
    const rt = ctx.response.get('X-Response-Time');
    // console.log(7);
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    // console.log(2);
    const start = Date.now();
    await next();
    // console.log(4);
    const ms = Date.now() - start;
    //console.log(5);
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
    //console.log(3)
    ctx.body = 'Hello World';
});

/* app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
}); */

/* app.on('error', err => {
    log.error('server error', err)
}); */


//  app.use(async ctx => {
//   ctx; // 这是 Context
//   ctx.request; // 这是 koa Request
//   ctx.response; // 这是 koa Response
// });

// ctx.state
// 推荐的命名空间，用于通过中间件传递信息和你的前端视图。

// ctx.state.user = await User.find(id);
 


// res.statusCode
// res.writeHead()
// res.write()
// res.end()


// ctx.throw(400);
// ctx.throw(400, 'name required');
// ctx.throw(400, 'name required', { user: user });

app.listen(3000);