const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectTopics = () => {

    const q = `SELECT * FROM topics;`;

    return db.query(q)
        .then(res => {
            return res.rows;
        });
}
