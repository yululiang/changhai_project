/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:48:08 
 * @Last Modified by:   yululiang 
 * @Last Modified time: 2018-11-21 17:48:08 
 */
const init = require('./init');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/changhai', require('./changhai/router'));
app.listen(8000);
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
});
logger.info('start app by node -> finished');
