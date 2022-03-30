const db = require('../db/connection.js');
const format = require('pg-format');
const commentsModel = require('./comments.models.js');
const errors = require('../errors.js');

/********************************************************
 *              PUBLIC METHODS
 ********************************************************/

exports.selectArticle = async (id) => {

    const promises = [];
    promises.push(this._selectByArticleId(id));
    promises.push(commentsModel.selectByArticleId(id));

    const [article, comments] = await Promise.all(promises);
    article.comment_count = comments.length;
    return article;
}

exports.selectAllArticles = async () => {
    
    const query = `SELECT articles.*, COUNT(comment_id)::INTEGER AS comment_count FROM articles
                    INNER JOIN comments ON comments.article_id = articles.article_id
                    GROUP BY articles.article_id
                    ORDER BY created_at DESC`;

    const articles = await db.query(query);
    return articles.rows;
}


exports.updateArticle = async (id, adjustedVotes) => {

    if(!adjustedVotes)
        return Promise.reject(errors.invalidPatchObj);

    query = `UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;`

    const res = await db.query(query, [adjustedVotes, id]);

    if (res.rows.length == 0)
        return Promise.reject(errors.idNotFoundObj);

    return res.rows[0];
}


/********************************************************
 *              PRIVATE METHODS
 ********************************************************/

exports._selectByArticleId = async (id) => {

    const query =  `SELECT * FROM articles
                    WHERE article_id = $1;`;

    const res = await db.query(query, [id]);

    if (res.rows.length == 0)
        return Promise.reject(errors.idNotFoundObj);

    return res.rows[0];
}