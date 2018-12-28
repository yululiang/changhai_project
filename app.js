/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:48:08 
 * @Last Modified by: yululiang
 * @Last Modified time: 2018-11-26 16:25:22
 */

//初始化
require('./init');
require('./common');

//express
const express = require('express');
const app = express();

//中间件
const middleWare = require('./middleWare');

//json解析
app.use(middleWare.jsonParse);

//urlencode
app.use(middleWare.urlencode);

//主路由
app.use('/pro', require('./router'));

//404
app.use(middleWare.fileNotFound);

//监听端口
app.listen(8000);

logger.info('start app by node -> finished');


