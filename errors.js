
exports.pathNotFound = (req, res, next) => {

    res.status(404).send({msg: 'Path Not Found'});
}

exports.psql_invalidType = (err, req, res, next) => {

    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid Query Type"});
    }
    else {
        next(err);
    }
}