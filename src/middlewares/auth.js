import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export async function userAuth(req, res, next) {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const tokenInfo = await jwt.verify(token, "Node_Dev@123");

    if (!tokenInfo) {
      throw new Error("UnAuthorised");
    }

    const user = await User.findById(tokenInfo._id);

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
}
