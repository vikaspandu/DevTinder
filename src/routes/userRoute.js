const express = require('express');
const { useAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { connection } = require('mongoose');
const User = require('../models/schema');

const userRouter = express.Router();

userRouter.get('/user/requests/received', useAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName progilePicture');

    console.log("Received connection requests:", connectionRequest);

    res.json({
      message: 'Received connection requests',
      data: connectionRequest,
    });

  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

userRouter.get('/user/connections', useAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
       { toUserId: loggedInUser._id, status: 'accepted' },
      ]
    }).populate('fromUserId', 'firstName lastName bio')
      .populate('toUserId', 'firstName lastName bio');

      const data = connections.map((row) => {
        if(row.fromUserId._id.equals(loggedInUser._id)){
          return row.toUserId;
        }
        return row.fromUserId;
      })

      res.json({
        message: 'Your connections',
        data,
      });

  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
})

userRouter.get('/feed', useAuth, async (req, res) => {
  try{

    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{fromUserId: loggedInUser._id, },{toUserId: loggedInUser._id,
    }]
    }).select('fromUserId toUserId ').populate('fromUserId', 'firstName lastName').populate('toUserId', 'firstName lastName');

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId._id.toString());
      hideUserFromFeed.add(request.toUserId._id.toString());
    });

    const users = await User.find({
      $and : [
        { _id: {$nin: Array.from(hideUserFromFeed)}},
        { _id: {$ne: loggedInUser._id}},
      ],
    }).select('firstName lastName skills bio')

    res.send(users);

  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
})

module.exports = userRouter;