const mongoose = require('mongoose')
const { Schema } = mongoose
const classCategorySchema = new Schema({
    name: {type: String, require},
    description: {type: String, require},
}, {
    timestamps: true,
})

const classCategoriesModel = mongoose.model('classcategories', classCategorySchema)
module.exports = classCategoriesModel