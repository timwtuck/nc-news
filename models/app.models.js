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

exports.selectUsers = () => {

    const query = `SELECT username FROM users;`;

    return db.query(query)
        .then(res => {
            return res.rows;
        });
}


exports.updateArticle = (id, adjustedVotes) => {

    let query = `SELECT votes FROM articles
                    WHERE article_id = $1;`;
                    
    return db.query(query, [id])
        .then(res => {

            console.log('here');
            let newVotes = res.rows[0].votes += adjustedVotes;
            query = `UPDATE articles
                    SET votes = $1
                    WHERE article_id = $2
                    RETURNING *;`;

            return db.query(query, [newVotes, id]);
        })
        .then(res => {
            return res.rows[0];
        });
}