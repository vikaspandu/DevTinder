const express = require("express");
const { useAuth } = require("../middlewares/auth");
const User = require("../models/schema");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", useAuth, async (req, res) =>{
  try{
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    const allowedStatus = ['interested', 'ignore'];
    if(!allowedStatus.includes(status)){
      return res
        .status(400)
        .json({message: 'Invalid Status'})
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res
        .status(400)
        .json({message: 'User not found'})
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId},
    ],
    })
    if(existingConnectionRequest){
      return res
        .status(400)
        .json({message: 'Connection request already exists'})
    }

    const connectionRequest  = new ConnectionRequest({
      fromUserId,
      toUserId, 
      status
    })

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    })
  } catch (error) {
   res.status(500).send("Something went wrong: " + error.message); // ❌ This will throw ReferenceErro
   
  }
})

requestRouter.post("/request/preview/:status/:requestId", useAuth, async (req, res)=> {
  try{
    const loggedInUser = req.user;
    const { status , requestId } = req.params;

    const allowedStatus = ['accepted', 'rejected'];
    if(!allowedStatus.includes(status)){
      return res
        .status(400)
        .json({message: 'Invalid Status'})
    }
    console.log(loggedInUser._id, requestId);

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })

    console.log(connectionRequest);

    if(!connectionRequest){
      return res
        .status(400)
        .json({message: 'Connection request not found or already processed'})
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: loggedInUser.firstName + " has " + status + " the connection request",
      data,
    });

  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
})

module.exports = requestRouter;