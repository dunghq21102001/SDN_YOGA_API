const mongoose = require('mongoose')
const { Schema } = mongoose

const item = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, require },
})

const cartSchema = new Schema({
    userId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    products: [item]
}, {
    timestamps: true,
})

const cartModel = mongoose.model('carts', cartSchema)
module.exports = cartModel


