const {topicsModel, articlesModel, commentsModel, usersModel} = require('../models/');

exports.getTopics = (req, res, next) => {

    topicsModel.selectTopics()
        .then(topics => {
            res.status(200).send({topics});
        });
};

exports.getArticle = (req, res, next) => {

    const {article_id} = req.params;

    articlesModel.selectArticle(article_id)
        .then(article => {
            res.status(200).send({article});
        })
        .catch(next);
}

exports.patchArticle = (req, res, next) => {

    const {article_id} = req.params;
    const updateObj = req.body;

    articlesModel.updateArticle(article_id, updateObj.inc_votes)
        .then(article => {
            res.status(200).send({article});
            })
        .catch(next);
}