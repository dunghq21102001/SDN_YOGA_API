const express = require('express')
const cors = require("cors");
const { ObjectId } = require('mongodb');
const { check, validationResult } = require('express-validator');
const productsModel = require('../models/Product')
const productRouter = express.Router()
productRouter.use(cors())
//GetAllProducts
productRouter.get('/', cors(), async (req, res) => {
    try {
        const listProduct = await productsModel.find({})
        res.send(listProduct)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})
//GetById
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
//CreateProduct
productRouter.post('/', [
    check("name").isLength({ min: 5, max: 100 }).withMessage("The length name from 5 to 100 character!!!"),
    check("price").isInt({min:1}).withMessage("Price have to greater than 0"),
    check("description").isLength({ min: 5, max: 100 }).withMessage("The length description from 5 to 100"),
    check("productcategories").notEmpty().withMessage("productcategories cannot empty !!!")
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }
    var name = req.body.name
    var price = req.body.price
    var description = req.body.description
    var images = req.body.images
    var productcategories = req.body.productcategories
    productsModel.create({
        name: name,
        price: price,
        description: description,
        images: images,
        productcategories:productcategories
    })
        .then(data => {
            res.json("Create Product Sucessfully")
        })
        .catch(err => {
            res.status(500).json("Cannot create product!!!")
        })
})
//UpdateProduct
productRouter.put('/:id',[
    check("name").isLength({ min: 5, max: 100 }).withMessage("The length name from 5 to 100 character!!!"),
    check("price").isInt({min:1}).withMessage("Price have to greater than 0"),
    check("description").isLength({ min: 5, max: 100 }).withMessage("The length description from 5 to 100"),
    check("productcategories").notEmpty().withMessage("productcategories cannot empty !!!")
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }
    var id = req.params.id
    var newName = req.body.name
    var newPrice = req.body.price
    var newDescription = req.body.description
    var newImages = req.body.images
    var newProductcategories = req.body.productcategories
    productsModel.findByIdAndUpdate(id, {
        _id: id,
        name: newName,
        price: newPrice,
        description: newDescription,
        images: newImages,
        productcategories: newProductcategories
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})
//DeleteProduct    
productRouter.delete('/:id', (req, res, next) => {
    var id = req.params.id
    productsModel.findOne({
        _id: id
    })
        .then(data => {
            if (data) {
                productsModel.deleteOne({
                    _id: id
                })
                    .then(data => {
                        res.json('Delete product successfully!!!')
                    })
            }
            else {
                res.json("This product has already deleted!!!")
            }
        })
        .catch(err => {
            res.json("Cannot find this id product!!!")
        })
})

module.exports = productRouter