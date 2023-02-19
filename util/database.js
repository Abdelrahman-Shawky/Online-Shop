const mysql = require('mysql2');

// pool of connections
// run multiple queries simultan
// pool finishes when app shut down
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'online-shop',
    port:'3307',
    password: 'rootroot'
});

module.exports = pool.promise();