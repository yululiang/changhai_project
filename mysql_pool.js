let mysql = require('mysql');
class MySqlClient {
    constructor() {
        this.conn = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'yululiang',
            database: 'test'
        });
        this.updateTime = new Date().getMilliseconds();
    }
}
if (global.initConn === 'undefined' || global.initConn) {
    createClient();
    global.initConn = false;
};  

function getInstance(option) {
    class Pool {
        constructor(option) {
            let { min_size, max_size } = option;
            this.min_size = min_size || 10;
            this.max_size = max_size || 100;
            this.clientList = [];
        }
        getClient() {
            let client;
            if (global.easyStack.length > 0) {
                client = global.easyStack.pop();
            } else if (global.clientList.length < this.max_size) {
                if (this.max_size - global.clientList.length > 10) {
                    createClient();
                    client = global.easyStack.pop();
                } else {
                    createClient(this.max_size - global.clientList.length);
                    client = global.easyStack.pop();
                }
            } else {
                return 'connection fulled';
            }
            resumeConn(client.conn);
            return client;
        }
    };
    if (!global.pool) {
        return new Pool(option); 
    } else {
        return pool;
    }
}

function createClient(size = 10) {
    for (let i = 0; i < size; i++) {
        let client = new MySqlClient();
        global.clientList.push(client);
        global.easyStack.push(client);
    }
}

function resumeConn(conn){
    if (conn.state === 'authenticated') {
        conn.resume();
    }
}

global.checkConnections = function checkConnections() {
    let cancelClients = [];
    let cancelEasy = [];
    for (let client of clientList) {
        if (new Date().getMilliseconds - client.updateTime > 10 * 60 * 1000) {
            client.conn.end();
            cancelClients.push(client);
            cancelEasy.push(client);
        }
    }
    for (let item of cancelClients) {
        global.clientList.remove(item);
    }
    for (let item of cancelEasy) {
        global.easyStack.remove(item);
    }
}

module.exports.getInstance = getInstance;