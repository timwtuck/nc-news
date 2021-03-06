const db = require('../db/connection.js');
const format = require('pg-format');
const commentsModel = require('./comments.models.js');
const topicsModel = require('./topics.models.js');
const usersModel = require('./users.models.js');
const errors = require('../errors.js');

/********************************************************
 *              PUBLIC METHODS
 ********************************************************/

exports.selectArticle = async (id) => {

    const query = `SELECT articles.*, COUNT(comment_id)::INTEGER AS comment_count FROM articles
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id;`;
  
    const results = await db.query(query, [id]);

    if (results.rows.length === 0)
        return Promise.reject(errors.idNotFoundObj);

    return results.rows[0];
}

exports.selectAllArticles = async (sortBy = 'created_at', order = 'desc', topic = '%%', author= '%%', limit = 10, page =1) => {

    await this._validateInput({sortBy, order, topic, limit, page, author});

    const offset =  limit * (page - 1);   
    const query = `SELECT articles.*, COUNT(comment_id)::INTEGER AS comment_count FROM articles
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    WHERE topic ILIKE $1 AND articles.author ILIKE $2
                    GROUP BY articles.article_id
                    ORDER BY ${sortBy} ${order}
                    LIMIT $3 OFFSET $4;`;
                    

    const articles = await db.query(query, [topic, author, limit, offset]);
    const total_count = await this._getTotalCount(topic, author);

    return {articles: articles.rows, total_count};
}

exports.insertArticle = async (author, title, topic, body) => {

    await this._validateInsert(author, title, topic, body);

    const query = `INSERT INTO articles
                    (author, title, topic, body)
                    VALUES
                    ($1, $2, $3, $4)
                    RETURNING *;`;

    const result = await db.query(query, [author, title, topic, body]);
    return result.rows[0];
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

exports.deleteArticleById = async (id) => {

    
    const query = `DELETE FROM articles
            WHERE article_id = $1
            RETURNING *;`;

    const res = await db.query(query, [id]);

    if (res.rows.length === 0)
        return Promise.reject(errors.idNotFoundObj);
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

exports._validateInput = async (input) => {

    const validSort = ['title', 'article_id', 'topic', 
                        'created_at', 'votes', 'comment_count', 'author'];

    const validOrder = ['asc', 'desc'];

    if ((input.sortBy && !validSort.includes(input.sortBy)) ||
        (input.order && !validOrder.includes(input.order)) ||
        (input.limit <= 0 || input.page <= 0)){
        return Promise.reject(errors.invalidQueryObj);
    }

    const promises = [this._validateTopic(input.topic)];

    if (input.author)
        promises.push(this._validateAuthor(input.author));

    return Promise.all(promises);
}

exports._validateTopic = async (topic, query=true) => {

    if (query && (!topic || topic === '%%'))
        return;

    const results = await topicsModel.selectTopics();
    const topics = results.map(topic => topic.slug);
    
    if(!topics.includes(topic))
        return Promise.reject(query ? errors.queryNotFoundObj
                                    : errors.invalidPostObj);
}

exports._validateAuthor = async (username) => {

    if (!username || username === '%%')
        return;

    const results = await usersModel.selectUsers();
    const usernames = results.map(user => user.username);

    if(!usernames.includes(username))
        return Promise.reject(errors.invalidPostObj);
}

exports._validateInsert = async (author, title, topic, body) => {

    if (!title || !body)
        return Promise.reject(errors.invalidPostObj);

    await this._validateAuthor(author);
    await this._validateTopic(topic, false);
}

exports._getTotalCount = async (topic, author) => {

    const query = `SELECT COUNT(article_id)::INTEGER AS total_count FROM articles
                    WHERE topic ILIKE $1 AND author ILIKE $2;`;

    const result = await db.query(query, [topic, author]);
    return result.rows[0].total_count;
}