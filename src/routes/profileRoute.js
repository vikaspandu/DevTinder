const express =require("express");
const User = require("../models/schema");
const { useAuth } = require("../middlewares/auth");
const { validateUpdateProfileData } = require("../utils/Validation");
const bcrypt = require('bcrypt');


const profileRouter = express.Router();

profileRouter.get("/profile/view", useAuth, async (req, res) => {
    try{
    const user = req.user;
    res.send(user);
    }
    catch (error) {
      res.status(500).send("Error fetching profile: " + error.message);
    }
  })

profileRouter.patch("/profile/edit", useAuth, async (req, res) => {
  try{
    if(!validateUpdateProfileData(req)){
      throw new Error("Invalid update fields");
    }
    //console.log(req.body);
    const loginUser = req.user;
    //console.log(loginUser);

    Object.keys(req.body).forEach((key) => {loginUser[key] = req.body[key]});
    res.send("Profile updated successfully");
     await loginUser.save(); // Save the updated user document

  }
  catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
})

profileRouter.patch("/profile/password", useAuth, async (req, res) => {
  try{
    const { oldPassword, newPassword} = req.body;
    
    const isPasswordMatch = await req.user.validatePassword(oldPassword);
    if(!isPasswordMatch){
      throw new Error("old password is incorrect");
    } else{
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      req.user.password = hashedPassword;
      await req.user.save();

      res.send("Password updated successfully");
    }
  }
  catch (error) {
    res.status(400).send("Error updating password: " + error.message);
  }
})

  module.exports = profileRouter;
  
  //$2b$10$TcmoHef.KVlVcntFMaJnOeY2dxZZLP1HMmze5qMsU21EukJDd8Lnq
  //$2b$10$3ymR6xwsrkVQZBxHcrn4CuEZnPuqNXs4d1ZZVIyajBMvWmTSyxUIK