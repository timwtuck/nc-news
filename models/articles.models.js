const db = require('../db/connection.js');
const format = require('pg-format');
const commentsModel = require('./comments.models.js');

/********************************************************
 *              PUBLIC METHODS
 ********************************************************/

exports.selectArticle = async (id) => {

    promises = [];
    promises.push(this._selectByArticleId(id));
    promises.push(commentsModel.selectByArticleId(id));

    const [article, comments] = await Promise.all(promises);
    article.comment_count = comments.length;
    return article;
}


exports.updateArticle = async (id, adjustedVotes) => {

    let query = `SELECT votes FROM articles
                    WHERE article_id = $1;`;
                    
    const res = await db.query(query, [id]);

    let newVotes = res.rows[0].votes += adjustedVotes;
    query = `UPDATE articles
            SET votes = $1
            WHERE article_id = $2
            RETURNING *;`;

    const res_1 = await db.query(query, [newVotes, id]);
    return res_1.rows[0];
}


/********************************************************
 *              PRIVATE METHODS
 ********************************************************/

exports._selectByArticleId = async (id) => {

    const query =  `SELECT * FROM articles
                    WHERE article_id = $1;`;

    const res = await db.query(query, [id]);

    if (res.rows.length == 0)
        return Promise.reject({status: 404, msg: "ID not found"});

    return res.rows[0];
}