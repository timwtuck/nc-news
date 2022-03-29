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
    
    const ids = await this._selectAllArticleIDs();
    const promises = [];

    ids.forEach(id => 
        promises.push(this.selectArticle(id.article_id)));

    const articles = await Promise.all(promises);

    return articles;
}


exports.updateArticle = async (id, adjustedVotes) => {

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

exports._selectAllArticleIDs = async (sorted_by='created_at', asc=false) => {

    const validItems = ['created_at', 'author', 'title', 'atricle_id',
                        'topic', 'votes'];
    
    if (!validItems.includes(sorted_by))
        return Promise.reject(errors.invalidQueryObj);

    const query = `SELECT article_id FROM articles
                    ORDER BY %I ${asc ? 'ASC' : 'DESC'};`;
    
    const sql = format(query, sorted_by);

    const results = await db.query(sql);
    return results.rows;
}