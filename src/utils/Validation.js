const validator = require("validator")

const  validateSignUpData = (req) => {
  const {firstName, lastName, email, password} = req.body;
  if(!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  else if(!validator.isEmail(email)) {
    throw new Error("Valid email is required");
  }
  else if(!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  }
}

const validateUpdateProfileData = (req) => {
  const allowEditFields = ["firstName", "lastName", "email", "bio", "phoneNo", "skills"];

  const updatedFields = Object.keys(req.body).every((field) => allowEditFields.includes(field));
  return updatedFields;
}

module.exports = {
  validateSignUpData,
  validateUpdateProfileData};