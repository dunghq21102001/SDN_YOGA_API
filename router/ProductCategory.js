const express = require('express')
const cors = require("cors");
const { ObjectId } = require('mongodb');

const productCategoryModel = require('../models/ProductCategory')
const productCategoryRouter = express.Router()
productCategoryRouter.use(cors())

productCategoryRouter.get('/', cors(), async (req, res, next) => {
    try {
        const listProduct = await productCategoryModel.find({}).populate('products')
        res.send(listProduct)

        
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

module.exports = productCategoryRouter