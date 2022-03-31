const db = require('../db/connection.js');
const format = require('pg-format');
const usersModel = require('./users.models.js');
const errors = require('../errors.js');

exports.selectByArticleId = async (id) => {

    const query = `SELECT comment_id, votes, created_at, 
                    author, body FROM comments
                    WHERE article_id = $1;`;

    const results = await db.query(query, [id]);
    return results.rows;
}

exports.insertCommentById = async (id, username, body) => {

    if(!username || !body)
        return Promise.reject(errors.invalidPostObj);

    const query = `INSERT INTO comments
                    (article_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;`;

    const results = await db.query(query, [id, username, body]);
    return results.rows[0];
}

exports.deleteCommentById = async (id) => {

    const query = `DELETE FROM comments
                    WHERE comment_id = $1;`;
    
    await db.query(query, [id]);
}