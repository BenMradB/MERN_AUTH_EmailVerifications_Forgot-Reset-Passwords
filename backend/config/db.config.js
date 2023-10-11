import mongoose from "mongoose";
import { config } from 'dotenv';

config();

const DB_URI = process.env.MONGODB_URI.replace('<password>', process.env.MONGODB_PASSWORD);
const connectToDB = async () => {
    try {
        const con = await mongoose.connect(DB_URI);
        console.log(`App Connected To The Database ${con.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        return process.exit(1);
    }
};

export default connectToDB;