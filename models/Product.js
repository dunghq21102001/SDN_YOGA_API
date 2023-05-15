const mongoose = require('mongoose')
const { Schema } = mongoose
const productSchema = new Schema({
    name: { type: String, require },
    price: { type: Number, require },
    description: { type: String, require },
    images: { type: Array, require },
}, {
    timestamps: true,
})

const productsModel = mongoose.model('products', productSchema)
module.exports = productsModel