const db = require('../db/connection.js');
const format = require('pg-format');
const errors = require('../errors.js');

exports.selectUsers = () => {

    const query = `SELECT username FROM users;`;

    return db.query(query)
        .then(res => {
            return res.rows; 
        });
}

exports.selectUserByUsername = async (username) => {

    return await this._selectByProperty('username', username);
};


/*******************************************************
 * PRIVATE METHODS
 *******************************************************/

exports._selectByProperty = async (property, value) => {

    const validProperties = ['username', 'name', 'avatar_url'];
    if(!validProperties.includes(property))
        return Promise.reject(errors.invalidDatabaseColummObj);

    const query = `SELECT * FROM users
                    WHERE %I = $1;`;

    const sql = format(query, property);
    const results = await db.query(sql, [value]);

    if(results.rows.length === 0)
        return Promise.reject(errors.idNotFoundObj);
    
    return results.rows[0];
}


