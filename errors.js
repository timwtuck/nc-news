
/*******************************************************
 * Error Objects
 ********************************************************/
exports.idNotFoundObj = {status: 404, msg: "ID Not Found"};
exports.invalidQueryObj = {status:400, msg: "Invalid Query Item"};
exports.invalidPatchObj = {status: 400, msg: "Invalid Patch Object"}



/*******************************************************
 * Error Handlers
 ********************************************************/
exports.pathNotFound = (req, res, next) => {

    res.status(404).send({msg: 'Path Not Found'});
}

exports.customError = (err, req, res, next) => {

    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
    else{ next(err);
    }
}

exports.psql_invalidType = (err, req, res, next) => {

    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid Data Type"});
    }
    else {
        next(err);
    }
}

exports.customError = (err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err);
    }
}