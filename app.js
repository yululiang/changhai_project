var express = require('express');
var app = express();
const config = require('./config');
const getConnection = require('./db_init');
app.listen(8080);
app.use(async (req, res) => {
    let conn = await getConnection();
    let result = await conn.queryAsync(`select * from user`);
    conn.releaseTest();
    console.log(result);
    res.send(result);
});




