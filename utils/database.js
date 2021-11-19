/* 
    Database connection is missing. That's why returning mock data
*/

const USER_LIST = {
    1:{
        id:1, 
        username:"JONSNOW", 
        email:"jonsnow@yopmail.com", 
        full_name:"The Bastard of Winterfell", 
        profile_picture:"nope",
        bio:"Warden of the North, King in the North, 998th Lord Commander of the Night's Watch",
        created_at: new Date().valueOf()
    },
    2:{
        id:2, 
        username:"DAENERYS", 
        email:"daenerystargaryen@yopmail.com", 
        full_name:"The Dragon Queen", 
        profile_picture:"nope",
        bio:"The Dragon Queen, The Queen Across the Sea, Daenerys Stormborn",
        created_at: new Date().valueOf()
    },
    3:{
        id:3, 
        username:"SANSA", 
        email:"sansastark@yopmail.com", 
        full_name:"Queen in the North", 
        profile_picture:"nope",
        bio:"Queen in the North, Lady of Winterfell",
        created_at: new Date().valueOf()
    },
}

const POST_LIST = {
    1:{
        id:1,
        description:"Test",
        user_id:1,
        image:"Nope",
        created_at: new Date().valueOf()
    },
    2:{
        id:2,
        description:"Test-2",
        user_id:2,
        image:"Nope-2",
        created_at: new Date().valueOf()
    },
    3:{
        id:3,
        description:"Test-3",
        user_id:2,
        image:"Nope-3",
        created_at: new Date().valueOf()
    },
    4:{
        id:4,
        description:"Test-4",
        user_id:3,
        image:"Nope-4",
        created_at: new Date().valueOf()
    }
}

const LIKE_LIST = {
    1:[
        {
            id:1,
            post_id:2,
            user_id:1,
            created_at: new Date().valueOf()
        },
        {
            id:2,
            post_id:3,
            user_id:1,
            created_at: new Date().valueOf()
        },
    ],
    2:[],
    3:[
        {
            id:3,
            post_id:1,
            user_id:3,
            image:"Nope-3",
            created_at: new Date().valueOf()
        },
        {
            id:4,
            post_id:4,
            user_id:3,
            image:"Nope-4",
            created_at: new Date().valueOf()
        }
    ],
}

const FOLLOWER_LIST = {
    1:[
        {
            follower_id:1,
            following_id:2,
            created_at: new Date().valueOf()
        },
        {
            follower_id:1,
            following_id:3,
            created_at: new Date().valueOf()
        },
    ],
    2:[
        {
            follower_id:2,
            following_id:1,
            created_at: new Date().valueOf()
        },
    ],
    3:[
        {
            follower_id:3,
            following_id:2,
            created_at: new Date().valueOf()
        }
    ],
}


module.exports = {

    getUserById: function(userId) {
        /**
         * SQL Query => 
         * SELECT * FROM user WHERE id = userId
         */
        return USER_LIST[userId];
    },

    getUserList: function(userIds) {
        /**
         * SQL Query => 
         * SELECT * FROM user WHERE id IN userIds
         */
        let userList = [];
        let userIdList = [];
        userIds.map(id => {
            if(!userIdList.includes(id)) {
                userIdList.push(id);
                userList.push(USER_LIST[id]);
            }
        })
        return userList;
    },

    getLikedPostIdsByUserId: function(userId, postIds) {
        /**
         * SQL Query => 
         * SELECT * FROM like WHERE user_id = userId AND post_id IN postIds
         */
        let likeList = LIKE_LIST[userId];
        if(likeList.length > 0){
            likeList = likeList.map(l => {
                return postIds.includes(l.post_id)? l:null;
            });
            likeList = likeList.filter(x => x)
            return likeList;
        }
        return [];
    },

    getPostList: function(postIds) {
        /**
         * SQL Query => 
         * SELECT * FROM post WHERE id IN postIds
         */
        let postList = [];
        postIds.map(id => {
            if(id <= 4) {
                postList.push(POST_LIST[id]);
            }else postList.push(null);
        })
        return postList;
    },

    getFollowerListByUserId: function(userId, userIds) {
        /**
         * SQL Query => 
         * SELECT * FROM follow WHERE follower_id = userId AND following_id IN userIds
         */

        let followerList = FOLLOWER_LIST[userId];
        followerList = followerList.map(f => {
            return userIds.includes(f.following_id)? f:null;
        });
        followerList = followerList.filter(x => x)
        return followerList;
    },

}