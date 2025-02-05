import express from 'express';
import { validateSignUpData } from '../utils/validations.js';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, age, skills, photoUrl } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age,
            ...(skills && { skills }),
            ...(photoUrl && { photoUrl })
        });

        await user.save();
        res.status(201).send("User saved successfully");
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(400).send("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const jwtToken = await user.getJWT();
            res.cookie('token', jwtToken);
            res.status(200).send("Login Successfully")
        }
        else {
            res.status(400).send("Invalid Credentials");
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong : " + err.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })

    res.status(200).send("Logged Out Successfully");
})