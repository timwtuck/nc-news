const db = require('../db/connection.js');
const format = require('pg-format');
const errors = require('../errors.js');

exports.selectTopics = () => {

    const query = `SELECT * FROM topics;`;

    return db.query(query)
        .then(res => {
            return res.rows;
        });
};

exports.insertTopic = async (slug, description) => {

    if (!slug || !description)
        return Promise.reject(errors.invalidPostObj);

    const query = `INSERT INTO topics
                    (slug, description)
                    VALUES
                    ($1, $2)
                    RETURNING *;`;

    const result = await db.query(query, [slug, description]);
    return result.rows[0];
}