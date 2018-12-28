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

// async function Test() {
//     this.name = 1;
// }
//
// let test = new Test();
// console.log(test.name);

