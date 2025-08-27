const jwt = require('jsonwebtoken');
const User = require('../models/schema'); 

const useAuth = async (req, res, next) => {
  try{
    const { token} = req.cookies;
    const decoded = await jwt.verify(token, 'DevTinder@12');

    const { _id } = decoded;
    const user = await User.findById(_id);
    if(!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
  }
}

module.exports = {
  useAuth
}