var maincontroller = require('../controllers/main.js')

module.exports = function(app) {
    //BEGIN of MAIN ROUTES
    app.route('/get_posts')
        .post(maincontroller.getPostList)
        .all(maincontroller.undefinedmethod)
    
    app.route('/merge_posts')
        .post(maincontroller.mergePostList)
        .all(maincontroller.undefinedmethod)    

    app.all('*', maincontroller.undefinedpath)    
}        