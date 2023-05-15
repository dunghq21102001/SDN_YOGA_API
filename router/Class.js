const express = require('express')
const cors = require("cors");

const classRouter = express.Router()
classRouter.use(cors())

classRouter.get('/test', cors(), (req, res, next) => {
    res.send('hello class route')
})

module.exports = classRouter