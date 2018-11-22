/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:48:25 
 * @Last Modified by: yululiang
 * @Last Modified time: 2018-11-21 17:50:55
 */
'use strict';
let mysql = require('mysql');
//创建连接池
let pool = mysql.createPool(require('./config').dbConfig);

/**
 *  获取连接
 */
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
    };
    con.releaseTest = () => {
        con.release();
        console.log('==============>释放连接');
    };
    return con;
}
module.exports = getConnection;