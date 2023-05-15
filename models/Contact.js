const mongoose = require('mongoose')
const { Schema } = mongoose
const contactSchema = new Schema({
    fullName: { type: String, require },
    email: { type: String, require },
    phone: { type: String, require },
    message: { type: String, require },
}, {
    timestamps: true,
})

const contactsModel = mongoose.model('contacts', contactSchema)
module.exports = contactsModel