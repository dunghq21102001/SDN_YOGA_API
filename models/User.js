const mongoose = require('mongoose')
const { Schema } = mongoose
const userSchema = new Schema({
    fullName: { type: String, require },
    email: { type: String, require },
    userName: { type: String, require },
    password: { type: String, require },
    salt: { type: String, require },
    address: { type: String, require },
    phone: { type: String, require },
    role: { type: String, require },
    image: { type: String, require },
    registeredCourses: { type: Array, require },
    classesTaught: { type: Array, require },
    createdDate: { type: String, require },
}, {
    timestamps: true,
})

const userModel = mongoose.model('users', userSchema)
module.exports = userModel