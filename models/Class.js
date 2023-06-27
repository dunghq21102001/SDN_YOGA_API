const mongoose = require('mongoose')
const { Schema } = mongoose
const classSchema = new Schema({
    name: { type: String, require },
    cost: { type: Number, require },
    numberSession: { type: Number, require },
    description: { type: String, require },
    note: { type: String, require },
    createdDate: { type: String, require },
    startedDate: { type: String, require },
    endDate: { type: String, require },
    classcategories: { type: Schema.Types.ObjectId, ref: 'classcategories'},
    userIds: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    ptIds: [{ type: Schema.Types.ObjectId, ref: 'users' }]
}, {
    timestamps: true,
})

const classModel = mongoose.model('classes', classSchema)
module.exports = classModel