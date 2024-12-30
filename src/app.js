import express from 'express';

const app = express();

app.use("/test",(req,res) => {
    res.send("Hello From Server");
})

app.use("/hello",(req,res) => {
    res.send("Hello Hello Hello");
})

app.use("/",(req,res) => {
    res.send("Hello Nodemon Test");
})

app.listen(7777,() => {
    console.log("Server is listening at port 7777")
});