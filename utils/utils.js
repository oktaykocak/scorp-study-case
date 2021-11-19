var _ = require('lodash');

module.exports = {

    createErrorResponse: function(res, params, error) {
        var code = error.code
        delete error.code
        return res.status(code).json(_.assign({status: 'ERROR'}, error, {meta: params}))
    },

    createValidationErrorResponse: function(res, params, validationResult) {
        return res
            .status(400)
            .json(_.assign({status: 'ERROR'}, {error: this.validationResponse(validationResult)}, {meta: params}))
    },

    createSuccessResponse: function(res, params, response) {
        return res.status(200).json(_.assign({status: 'OK'}, {data: response}, {meta: params}))
    },

    validationResponse: function(validationResult) {
        var errors = []
        validationResult.forEach(element => {
            errors.push({
                field: element.field,
                message: element.message,
            })
        })
        return errors
    },

    comparePost: function(first, second){
        if(first.created_at > second.created_at){
            return true;
        }else if( first.created_at === second.created_at){
            return first.id >= second.id; 
        }else return false;
    },

}