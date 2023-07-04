const mongoose = require('mongoose')
const { Schema } = mongoose
const requestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'classes', required: true },
    requestDetails: { type: String, required: true },

}, {
    timestamps: true,
})

const productsModel = mongoose.model('requests', requestSchema)
module.exports = productsModel