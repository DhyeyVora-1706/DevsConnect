import mongoose from "mongoose";
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        index: true,    
        required: [true, "First Name is required"],
        minLength: [3, "First name length is minimum 3 characters"]
    },
    lastName: {
        type: String,
        required: [true, "lastname is required"]
    },
    emailId: {
        type: String,
        required: [true, "Email Id is required"],
        unique: [true, "Given emailId is already registered"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age should be 18 or more"]
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngall.com/profile-png/download/51602/",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("photURL should be a proper URL")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

userSchema.index({ firstName: 1, lastName: 1 })

userSchema.methods.getJWT = async function () {
    const jwtToken = await jwt.sign({ _id: this._id }, "Node_Dev@123", { expiresIn: '7d' });
    return jwtToken;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const isPasswordValid = await bcrypt.compare(passwordByUser, this.password);
    return isPasswordValid;
}

export const User = mongoose.model("User", userSchema);