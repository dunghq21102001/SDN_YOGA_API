const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    fullName: { type: String },
    email: { type: String },
    userName: { type: String, require },
    password: { type: String, require },
    salt: { type: String },
    address: { type: String },
    phone: { type: String },
    role: { type: String, require },
    image: { type: String, require },
    registeredCourses: [{ type: Schema.Types.ObjectId, ref: "classes" }],
    classesTaught: [{ type: Schema.Types.ObjectId, ref: "classes" }],
    createdDate: { type: String, require },
    cart: { type: Schema.Types.ObjectId, ref: "carts" },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
