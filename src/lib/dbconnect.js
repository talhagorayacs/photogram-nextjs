import mongoose from "mongoose";

const connection = {
    isConnected:false
}

async function dbConnect() {
        if (connection.isConnected) {
            console.log("Database already connected");
            return
        }

       try {
        const db = await mongoose.connect(process.env.MONGODB_URI)
 
        connection.isConnected = true
        
 
        console.log("database connected successfully");
       } catch(error) {
        console.log("error in connecting database " , error);
        
       }
       
}


export default dbConnect;