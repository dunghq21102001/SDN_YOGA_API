const express = require('express')
const cors = require("cors");
const classModel = require('../models/Class');

const classRouter = express.Router()
classRouter.use(cors())

classRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listClasses = await classModel.find({}).populate('classcategories').populate('userIds').populate('ptIds')
        res.send(listClasses)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = classRouter