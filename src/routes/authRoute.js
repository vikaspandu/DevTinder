const express = require('express');
const User = require('../models/schema');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/Validation');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try{
    validateSignUpData(req);
    const { firstName, lastName, age, gender, email, password, phoneNo, skills } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10)  // Ideally, you should hash the password here
 
    const obj = new User({
      firstName,
      lastName,
      email,
      password : hashedPassword,
      age,
      phoneNo,
      skills, // Store the hashed password
    });
    await obj.save();
    res.send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error creating user: " + error.message);} 
  });

  authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try{
      const user = await User.findOne({email : email});
      if(!user) {
        throw new Error("user not found");
    }
     const isMatch = await user.validatePassword(password); // Validate the password using the method defined in the schema 
      if(isMatch) {
        const token = await user.getJWT(); 
        res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)}); 
        res.send("Login successful")
      }
      else {
        res.status(401).send("Invalid credentials");}
      }
    catch (error) {
      res.status(400).send("Error logging in: " + error.message);
    }
  })

  authRouter.post("/logout", async (req, res) => {
    res.cookie('token', "NULL", {expires: new Date(Date.now())});

    res.send("Logout successful");

  })

  module.exports = authRouter;