const db = require('../db/connection.js');
//const format = require('pg-format');

exports.selectTopics = () => {

    const query = `SELECT * FROM topics;`;

    return db.query(query)
        .then(res => {
            return res.rows;
        });
};