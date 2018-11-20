let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'yululiang',
    database: 'test'
});
async function getConnection() {
    console.debug('==============>获取连接');
    let con = await new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(con);
            }
        });
    });
    con.queryAsync = (...args) => {
        return new Promise((resolve, reject) => {
            con.query(...args, (err, result) => {
                if (err)  {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } 
    con.releaseTest = () => {
        con.release();
        console.debug('==============>释放连接');
    };
    return con;
}
module.exports = getConnection;