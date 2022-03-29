const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectByArticleId = async (id) => {

    const query = `SELECT comment_id, votes, created_at, 
                    author, body FROM comments
                    WHERE article_id = $1;`;

    const results = await db.query(query, [id]);
    return results.rows;
}