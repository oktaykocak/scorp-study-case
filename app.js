const express = require('express')
const cors = require('cors')
const routes = require('./routes/route.js')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(error, req, res, next) {
    return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid JSON',
    })
})
app.use(cors())
routes(app)
 
app.listen(port, function() {
    console.log('Express server listening on port %s', port)
})