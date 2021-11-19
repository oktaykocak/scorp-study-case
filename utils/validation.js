let Validator = require('fastest-validator');

const v = new Validator();

var schemaGetPostList = {
    userId: { type: "number", positive: true, integer: true },
    postIds: { type: "array", items: {
        type: "number", positive: true, integer: true
    } }
}

var schemaMergePostList = {
    postList: { type: "array", items: {
        type: "array", items: {
            type: "object", props: { 
                id: { type: "number", positive: true, integer: true },
                description: { type: "string" },
                image: { type: "string" },
                created_at:{ type: "number", positive: true, integer: true },
            } 
        }
        } 
    }
}

module.exports = {
    checkGetPostList: v.compile(schemaGetPostList),
    checkMergePostList: v.compile(schemaMergePostList)
}