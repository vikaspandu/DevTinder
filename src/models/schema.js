const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: {
    type: String,
  },
  age :{
    type: Number,
  },
  gender :{
    type: String,
    Validate(value) {
      if(!["male", "female", "other"].includes(value)) {
        throw new Error("not valid gender");}
  }},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    Validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
  }},
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
  },
  skills: {
    type: [String],
  },
  bio: {
    type: String,
    maxLength: 500, }
  },
  {
    timestamps: true
  });

  userSchema.methods.getJWT =  async function() {
    const user = this;
    const token = await jwt.sign({_id : user._id}, 'DevTinder@12', {
      expiresIn: '7d'});
    return token;
  }

  userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
  }


 module.exports =  mongoose.model('User', userSchema);
