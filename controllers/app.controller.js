const m = require('../models/app.models.js');

exports.getTopics = (req, res, next) => {

    m.selectTopics()
        .then(topics => {
            res.status(200).send({topics});
        });
};

exports.getArticles = (req, res, next) => {

    const {article_id} = req.params;

    m.selectArticles(article_id)
        .then(articles => {
            console.log(articles);
            res.status(200).send({articles});
        });
}