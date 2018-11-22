/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:48:08 
 * @Last Modified by:   yululiang 
 * @Last Modified time: 2018-11-21 17:48:08 
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/changhai', require('./changhai/router'));
app.listen(8000);
//init log4j
const log4js = require('log4js');
log4js.configure(config.log4jsConfig);
global.logger = log4js.getLogger('oth');
global.getConnection = require('./db_init');
//init common function
const common = require('./common');
//init global object
const global_resource = require('./global_resource');
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});
logger.info('load app -> finished');
