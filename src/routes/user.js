import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { ConnectionRequestModel } from '../models/connectionRequest.js';
import { User } from '../models/user.js';
import mongoose from 'mongoose';
export const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName photoUrl about");

        return res.status(200).json({
            data: receivedRequests
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", "firstName lastName photoUrl about")
            .populate("toUserId", "firstName lastName photoUrl about")

        const response = connections.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId
            }
            return connection.fromUserId
        })

        return res.status(200).json({ response });
    } catch (err) {
        res.status(400).send(err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId");

        const hideFeedUsers = new Set();

        connectionRequests.forEach((req) => {
            hideFeedUsers.add(req.fromUserId.toString());
            hideFeedUsers.add(req.toUserId.toString())
        })

        const feed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideFeedUsers) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
        .select("firstName lastName photoUrl about age")
        .skip(skip)
        .limit(limit)

        res.status(200).json({
            data : feed
        });

    } catch (err) {
        res.status(400).json(err.message);
    }
})