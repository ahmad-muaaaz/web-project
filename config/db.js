import mongoose from 'mongoose'

const connectDB = async() =>{

    try {
        

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Mongo DB Database"+conn.connection.host);
     } catch(error){
        console.log("Error in Mongo DB"+error)
        
    }
    
}
export default connectDB;