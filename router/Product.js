const express = require('express')
const cors = require("cors");

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

module.exports = productRouter