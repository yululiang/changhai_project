const sql = sqls.authority.login;

/**
 * 登陆
 * @param {*} conn 
 * @param {*} data 
 */
async function login(conn, data) {

    let { login_user, login_pwd } = data;

    try {
        login_pwd = md5(login_pwd);
        let result = await conn.queryAsync(sql.findUserByAccount, [login_user]);
        let { code, pwd } = result[0];

        if (login_user !== code || login_pwd !== pwd) {
            return Promise.reject('login fail');
        }

        return Promise.resolve('login success');
    } catch (error) {
        return Promise.reject(error);
    }
}




module.exports.login = login;