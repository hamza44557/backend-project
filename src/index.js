import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
dotenv.config({ path: "./.env" });
import app from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is listening on port ${process.env.PORT}`);
    })
})
.catch( (err)=>{
    console.log("Mongo DB connection Failed !!!", err)
})