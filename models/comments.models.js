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

  /*  
  HELLO NORTHCODERS TEAM--> I would love to know why this doesn't work?! I kept getting Syntax Error
  which seems to be due to the Date object. Yet in the utils.js the date converter returns
  a date object, and also this returns synatx error and not type error so not entirely sure why. 
  I know I don't need this to complete the ticket, but would still love to know why! Thanks <3

  const query = `INSERT INTO comments
                    (article_id, author, body, created_at, votes)
                    VALUES
                    (1, 'butter_bridge', 'hello', ${new Date()}, 0);`;
*/
    const query = `INSERT INTO comments
                    (article_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *;`;

    const results = await db.query(query, [id, username, body]);
    return results.rows[0];
}