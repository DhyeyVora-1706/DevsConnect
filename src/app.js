import express from "express";
import cookieparser from "cookie-parser";
import { connectToDB } from "./config/database.js";
import { User } from "./models/user.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { requestRouter } from "./routes/request.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieparser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      res.status(404).send("Can't find user");
    }
    res.status(200).send(user);
  } catch (err) {
    res
      .status(400)
      .send("SOmething went wrong searching for a user ", err.message);
  }
});

app.delete("/user", async (req, res) => {
  const { userId } = req.body;
  try {
    if (userId) {
      const user = await User.findByIdAndDelete(userId);
      if (user) {
        res.status(200).json({
          message: "User deleted successfully",
          data: user,
        });
      } else {
        res.status(404).send("User with given userId Not Found");
      }
    } else {
      res.status(400).send("UserId is not passed");
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "gender", "about", "skills"];

    const isAllowedUpdates = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isAllowedUpdates) {
      throw new Error("Updates Not allowed");
    }

    if (req.body.skills.length > 10) {
      throw new Error("Can't have more than 10 skills");
    }

    if (userId) {
      const user = await User.findByIdAndUpdate(userId, req.body, {
        returnDocument: "after",
        runValidators: true,
      });
      if (user) {
        res.status(200).json({
          message: "document updated sucessfully",
          data: user,
        });
      } else {
        res.status(404).send("Id provided for delete is not found");
      }
    } else {
      res.status(400).send("UserId is not passed");
    }
  } catch (err) {
    res.status(400).send(`Something went wrong : ${err.message}`);
  }
});

async function startServer() {
  try {
    await connectToDB();
    app.listen(7777, () => {
      console.log("Server is listening at port 7777");
    });
  } catch (err) {
    console.error("Failed to start the server due to DB connection error.");
    process.exit(1); // Exit the process on critical failure
  }
}

await startServer();
