const m = require('../models/app.models.js');

exports.getTopics = (req, res, next) => {

    m.selectTopics()
        .then(topics => {
            console.log(topics);
            res.status(200).send({topics});
        });
};