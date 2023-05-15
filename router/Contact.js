const express = require('express')
const cors = require("cors");

const contactRouter = express.Router()
contactRouter.use(cors())

contactRouter.get('/test', cors(), (req, res, next) => {
    res.send('hello contact route')
})

module.exports = contactRouter