const db = require('../db/connection.js');
const format = require('pg-format');
const usersModel = require('./users.models.js');
const errors = require('../errors.js');

exports.selectByArticleId = async (id, limit=10, page=1) => {

    if (limit <= 0 || page <= 0)
        return Promise.reject(errors.invalidQueryObj);

    const offset = limit * (page-1);
    const query = `SELECT comment_id, votes, created_at, 
                    author, body FROM comments
                    WHERE article_id = $1
                    LIMIT $2 OFFSET $3;`;

    const results = await db.query(query, [id, limit, offset]);
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

exports.updateComment = async (id, newVote) => {

    if (!newVote)
        return Promise.reject(errors.invalidPatchObj);

    const query = `UPDATE comments
                    SET votes = votes + $1
                    WHERE comment_id = $2
                    RETURNING *;`;

    const result = await db.query(query, [newVote, id]);

    if (result.rows.length === 0)
        return Promise.reject(errors.idNotFoundObj);

    return result.rows[0];
}

exports.deleteCommentById = async (id) => {

    const query = `DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING *;`;
    
    const result = await db.query(query, [id]);

    if(result.rows.length === 0)
        return Promise.reject(errors.idNotFoundObj);
}

