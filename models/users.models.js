const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectUsers = () => {

    const query = `SELECT username FROM users;`;

    return db.query(query)
        .then(res => {
            return res.rows;
        });
}