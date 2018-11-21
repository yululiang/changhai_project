/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:48:08 
 * @Last Modified by:   yululiang 
 * @Last Modified time: 2018-11-21 17:48:08 
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/changhai', require('./changhai/router'));
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});
app.listen(8000);
//init common function
const common = require('./common');
//init global object
const global_resource = require('./global_resource');
console.log('===========>app start over');
