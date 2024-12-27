import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURL=process.env.DB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    age:Number
});

const user = mongoose.model(process.env.COLLECTION_NAME,userSchema);

export default user;