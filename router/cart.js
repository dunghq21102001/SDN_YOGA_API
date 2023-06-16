const express = require('express')
const cors = require("cors");
const { ObjectId } = require('mongodb');

const cartModel = require('../models/cart')
const cartRouter = express.Router()
cartRouter.use(cors())

cartRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listCart = await cartModel.find({}).populate('userId')
        res.send(listCart)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = cartRouter