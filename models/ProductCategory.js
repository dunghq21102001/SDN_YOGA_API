const mongoose = require('mongoose')
const { Schema } = mongoose
const productCategorySchema = new Schema({
    name: { type: String, require },
    description: { type: String, require },
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }]
}, {
    timestamps: true,
})

const productCategoriesModel = mongoose.model('productcategories', productCategorySchema)
module.exports = productCategoriesModel