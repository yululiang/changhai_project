const pool = require('./mysql_pool').getInstance({ min_size: 10, max_size: 100 });
class Connection {
    constructor() {
        let client = pool.getClient();
        this.conn = client.conn;
    }
    query(...sqlArgs) {
        return new Promise((resolve, reject) => {
            this.conn.query(...sqlArgs, (err, result, fields) => {
                if(err) {
                    this.conn.rollback();
                    reject(err);
                } else {
                    this.conn.commit();
                    resolve(result);
                }
                this.return();
                global.queryCount++;
                if (queryCount === 2000) {
                    global.checkConnections();
                }
                return;
            });
        });
    }
    rollback() {
        this.conn.rollback();
    }
    commit() {
        this.conn.commit();
    }
    return() {
        global.clientList.splice(global.clientList.indexOf(this));
        global.easyStack.push(this);
    }
    close() {
        if (this.conn != null && this.conn.end) {
            this.conn.end();
        }
    }
}

module.exports = Connection;


