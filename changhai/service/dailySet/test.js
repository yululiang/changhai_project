/**
 * service例（业务层）
 * @param conn
 * @param data
 * @returns {Promise.<*>}
 */
module.exports.test = async function main(conn, data) {
    let sql = `select * from user`;
    return await conn.queryAsync(sql);
};
