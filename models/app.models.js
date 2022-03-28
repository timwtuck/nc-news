const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectTopics = () => {

    const query = `SELECT * FROM topics;`;

    return db.query(query)
        .then(res => {
            return res.rows;
        });
};

exports.selectArticles = (id) => {

    const query =  `SELECT * FROM articles
                    WHERE article_id = $1;`;

    return db.query(query, [id])
        .then(res => {
            return res.rows;
        });
}
