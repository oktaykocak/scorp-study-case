const Utils = require('../utils/utils.js')
const Validator = require('../utils/validation.js')
const Database = require('../utils/database.js')
const {omit, cloneDeep} = require('lodash');

const LIST_OF_POST =
[ 
    [
        {
            id:1,
            description:"Test",
            image:"image-1",
            created_at: new Date().valueOf() -1000
        },
        {
            id:2,
            description:"Test",
            image:"image-2",
            created_at: new Date().valueOf() -500
        },
        {
            id:3,
            description:"Test",
            image:"image-3",
            created_at: new Date().valueOf() -300
        },
    ],
    [
        {
            id:4,
            description:"Test",
            image:"image-4",
            created_at: new Date().valueOf() -400
        },
        {
            id:5,
            description:"Test",
            image:"image-5",
            created_at: new Date().valueOf() -200
        },
        {
            id:6,
            description:"Test",
            image:"image-6",
            created_at: new Date().valueOf() -100
        },
    ],
    [
        {
            id:7,
            description:"Test",
            image:"image-7",
            created_at: new Date().valueOf() -1200
        },
        {
            id:8,
            description:"Test",
            image:"image-8",
            created_at: new Date().valueOf() -600
        },
        {
            id:9,
            description:"Test",
            image:"image-9",
            created_at: new Date().valueOf() -400
        },
    ],


]

exports.undefinedpath = function(req, res) {
    console.error('%s path is not found...', req.path)
    Utils.createErrorResponse(res, req.body, {
        errors: [
            {
                message: 'Path is not found!!!',
                path: req.path,
            },
        ],
        code: 400,
    })
}

exports.undefinedmethod = function(req, res) {
    console.error('%s method is not found in %s path', req.method, req.path)
    Utils.createErrorResponse(res, req.body, {
        errors: [
            {
                message: 'Method is not found!!!',
                method: req.method,
                path: req.path,
            },
        ],
        code: 400,
    })
}

exports.getPostList = async function(req, res) {
    const params = req.body
    const validationResult = Validator.checkGetPostList(params)
    if (validationResult != true) {
        Utils.createValidationErrorResponse(res, params, validationResult)
    } else {
        const userId = params.userId;
        const postIds = params.postIds;
        let postList = Database.getPostList(postIds);
        let userIds = []
        postList.map(function (post) {
            if( post && !userIds.includes(post.user_id)) userIds.push(post.user_id);
        });
        //console.log('USER IDS', userIds);
        let userList = Database.getUserList(userIds);
        //console.log('USER LIST', userList);
        let likedList = Database.getLikedPostIdsByUserId(userId, postIds);
        //console.log('LIKED LIST', likedList);
        let followerList = Database.getFollowerListByUserId(userId, userIds);
        //console.log('FOLLOWER LIST', followerList);
        postList.map(post => {
            if(post){
                let user = userList.find(u => u.id === post.user_id);
                user = omit(user,['email', 'bio', 'created_at']);
                let liked = likedList.find( l => l.post_id === post.id);
                // liked can be return "undefined"
                post.liked = liked ? true:false;
                let isFollower = followerList.find(f => f.following_id === user.id)
                // isFollower can be return "undefined"
                user.followed = isFollower? true:false;
                post.owner = user;
                post = omit(post, ['user_id'])
            }
            return post;
        })
        Utils.createSuccessResponse(res, params, postList);
    }
}

exports.mergePostList = async function(req, res) {
    const params = req.body
    
    const validationResult = Validator.checkMergePostList(params)
    if (validationResult != true) {
        Utils.createValidationErrorResponse(res, params, validationResult)
    } else {
        
        // Selection correctly works

        //let LP = cloneDeep(LIST_OF_POST);
        let LP = cloneDeep(params.postList);
        let N = 0;
        LP = LP.map(l => { 
            if(l.length > 0){
                N += l.length;
                return l;
            }
            //when nested list can be empty, if it is removed and loop number will be decreased.
            return null;
        });
        LP = LP.filter(x => x) 
        let newList = [];
        for(i=0;i<N;i++){
            let deletedListIndex = 0;
            if(LP.length>1){
                for(j=1;j<=LP.length-1;j++){
                    //console.log('J', j)
                    const firstPost = LP[deletedListIndex].slice(-1)[0];
                    const secondPost =  LP[j].slice(-1)[0];
                    deletedListIndex = Utils.comparePost(firstPost, secondPost)? deletedListIndex : j
                }
            }
            //console.log('deletedListIndex', deletedListIndex)
            let deletedPostofList = LP[deletedListIndex];
            let deletedPost = deletedPostofList.slice(-1)[0];
            //console.log('deletedPost', deletedPost);
            deletedPostofList.pop();
            if(deletedPostofList.length>0){
                LP[deletedListIndex] = deletedPostofList;
            } else{
                LP.splice(deletedListIndex, 1);
            }
            if(newList.length === 0){
                newList.push(deletedPost);
            } else if(newList.slice(-1)[0].id != deletedPost.id){
                newList.push(deletedPost)
            } 
        }
        //console.log('New list', newList);
        Utils.createSuccessResponse(res, params, newList);
    }
}