const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// // generating tokens

employeeSchema.methods.generateAuthToken = async function () {
  const token_val = jwt.sign(
    { _id: this._id.toString() },
    process.env.SECRET_KEY
  );
  this.tokens = this.tokens.concat({ token: token_val });
  await this.save();
  return this.tokens;
};

//converting password into hash
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

// now we need to create a collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
