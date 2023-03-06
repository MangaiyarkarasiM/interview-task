const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    dob: {
      type: Date,
      required: true,
      validate: (value) => {
        return validator.isDate(value);
      },
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserDetails = mongoose.model("users", userSchema);

module.exports = { UserDetails };
