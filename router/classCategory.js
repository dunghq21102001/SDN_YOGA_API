const express = require('express')
const cors = require("cors");
const { ObjectId } = require('mongodb');

const classCategoryModel = require('../models/classCategory')
const classCategoryRouter = express.Router()
classCategoryRouter.use(cors())

classCategoryRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listCLass = await classCategoryModel.find({})
        res.send(listCLass)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = classCategoryRouter