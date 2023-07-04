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
// PT register Class
classRouter.put('/:id', (req, res, next) => {
    var id = req.params.id;
    var newptId = req.body.ptIds;
    classModel.findById(id)
        .then(data => {
            let arr = data.ptIds || []; 
            if (!arr.includes(newptId)) { 
                arr.push(newptId);
            }
            else{
                res.json("PT already register this class!!")
            }
            classModel.findByIdAndUpdate(id, { ptIds: arr })
                .then(updatedData => {
                    res.json("Update successfully");
                })
                .catch(err => {
                    res.status(500).json("Cannot update!!!");
                });
        })
        .catch(err => {
            res.status(404).json("Class not found!!!");
        });
});
// User register Class
classRouter.put('/choosen/:id',(req, res, next) => {
    var id = req.params.id
    var newuserIds= req.body.userIds
    classModel.findById(id)
        .then(data => {
            let arr = data.userIds || []; 
            if (!arr.includes(newuserIds)) { 
                arr.push(newuserIds);
            }
            else{
                res.json("User already register this class!!")
            }
            classModel.findByIdAndUpdate(id, { userIds: arr })
                .then(updatedData => {
                    res.json("Update successfully");
                })
                .catch(err => {
                    res.status(500).json("Cannot update!!!");
                });
        })
        .catch(err => {
            res.status(404).json("Class not found!!!");
        });
})



module.exports = classRouter