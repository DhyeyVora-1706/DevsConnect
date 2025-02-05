import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { validateEditFieldsData } from '../utils/validations.js';
export const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, (async (req, res) => {
    try {
        const isValidRequest = validateEditFieldsData(req);

        if (!isValidRequest) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.status(200).send(`${loggedInUser.firstName} Your Profile has been edited successfully`);

    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`);
    }
}))