const express = require('express')
const cors = require("cors");
const classModel = require('../models/Class');
const userModel = require('../models/User');
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

classRouter.put('/:id',(req, res, next) => {
    var id = req.params.id
    var newptId= req.body.ptIds
    console.log(newptId);
    let arr = []
    arr.push(newptId)
    classModel.findByIdAndUpdate(id, {
        ptIds:arr
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})

classRouter.put('/choosen/:id',(req, res, next) => {
    var id = req.params.id
    var newuserIds= req.body.userIds
    let arr = []
    arr.push(newuserIds)
    classModel.findByIdAndUpdate(id, {
        userIds:arr
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})



module.exports = classRouter