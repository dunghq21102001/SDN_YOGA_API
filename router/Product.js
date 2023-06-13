const express = require('express')
const cors = require("cors");
const { ObjectId } = require('mongodb');

const productsModel = require('../models/Product')
const productRouter = express.Router()
productRouter.use(cors())

productRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listProduct = await productsModel.find({})
        res.send(listProduct)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

productRouter.get('/:id', cors(), async (req, res) => {
    try {
        const id = new ObjectId(req.params['id'])
        const filter = { _id: id }
        const product = await productsModel.findOne(filter)
        if (product) return res.send({ data: product })
        else return res.send({ message: "product not found" })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = productRouter