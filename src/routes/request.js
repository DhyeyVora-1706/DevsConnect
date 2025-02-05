import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { ConnectionRequestModel } from '../models/connectionRequest.js';
import {User} from '../models/user.js';

export const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatusValues = ["ignored","interested"];

        if(!allowedStatusValues.includes(status)){
            return res.status(400).send(`Status ${status} is invalid for this request , status allowed is ignored or interested`)
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        })

        const toUser = await User.findById(toUserId);

        if(!toUser){
            return res.status(404).send(`User Not Found`);
        }

        if(existingConnectionRequest){
            return res.status(400).json({
                message:"Connection Request Already Exists"
            });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        let message="";
        if(status === "ignored"){
            message = `${req.user.firstName} has ignored ${toUser.firstName}`
        }   
        else if(status === "interested"){
            message = `${req.user.firstName} is interested in ${toUser.firstName}`
        }
        return res.status(200).json({
            message,
            data
        })
    }catch(err){
        return res.status(400).send("ERROR : " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth ,async (req, res) => {
    try{
        const {status,requestId} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status is not allowed"
            })
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status:"interested"            
        })

        if(!connectionRequest){
            return res.status(404).json({
                message : "Connection Request Not Found"
            })
        }

        connectionRequest.status = status;

        const response = await connectionRequest.save();
        return res.status(200).json({
            message : `Connection request ${status}`,
            data : response
        })

    }catch(err){
        res.status(400).send(err.message);
    }
})