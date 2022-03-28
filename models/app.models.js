const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectTopics = () => {

    const q = `SELECT * FROM topics;`;

    return db.query(q)
        .then(res => {
            return res.rows;
        });
}


exports.updateArticle = (id, adjustedVotes) => {

    // catch invalid object errors
    if (typeof adjustedVotes !== 'number'){
        return Promise.reject({status: 400, msg: "Invalid Object"});
    }

    let query = `SELECT votes FROM articles
                    WHERE article_id = $1;`;
                    
    return db.query(query, [id])
        .then(res => {

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