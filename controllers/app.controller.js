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
        })
        .catch(next);
}

exports.patchArticle = (req, res, next) => {

    const {article_id} = req.params;
    const updateObj = req.body;

    m.updateArticle(article_id, updateObj.inc_votes)
        .then(article => {
            res.status(200).send({article});
       })
       .catch(next);
}