const express = require('express');
const connect = require('./src/config/database');
const User = require('./src/models/schema');  
const { validateSignUpData } = require('./src/utils/Validation');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
const { useAuth } = require('./src/middlewares/auth'); 

const authRouter = require('./src/routes/authRoute');
const requestRouter = require('./src/routes/requestRoute'); 
const profileRouter = require('./src/routes/profileRoute');
const userRouter = require('./src/routes/userRoute'); 


const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.use('/', authRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', userRouter);

  
connect().then(() => {
  console.log('Database connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}) .catch(err => {
  console.error('Database connection failed:', err);
});