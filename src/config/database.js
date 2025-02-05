import mongoose from "mongoose";

const dbUrl = "mongodb+srv://namastenode2024:cZnZY1uIzRlYo1SG@demo-cluster.hfrzg.mongodb.net/devsconnect";

export async function connectToDB(){
    try{
        await mongoose.connect(dbUrl);
        console.log("DB Connected Successfully");
    }
    catch(err){
        console.error("Error in DB connection");
        console.error(err);
    }
}