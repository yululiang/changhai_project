const moment = require('moment');

/**
 * 注册
 * @param conn
 * @param data { user_name, user_code. user_pwd }
 * @returns {Promise<void>}
 */
async function register(conn, data) {

    let { user_name, user_code, user_pwd } = data;

    if (!(user_name && user_code && user_pwd)) {
        return Promise.reject('参数不完整');
    }

    try {
        //重复注册检查
        let resultSet = await conn.queryAsync(`select code from user_account where code = '${user_code}'`);
        if (Array.isArray(resultSet) && resultSet.length > 0) {
            return Promise.reject('用户已存在');
        }

    } catch (e) {
        return Promise.reject(e);
    }

    let sql = `insert into user_account (name, code, pwd, create_time,modify_time) values (?,?,?,?,?)`;
    let name = user_name;
    let code = user_code;
    let pwd = md5(user_pwd);
    let create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let modify_time = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        await conn.queryAsync(sql, [name, code, pwd, create_time, modify_time]);
        return Promise.resolve('注册成功');
    } catch (e) {
        return Promise.reject('注册失败：' + e);
    }
}

exports.register = register;