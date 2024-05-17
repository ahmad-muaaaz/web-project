import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoute.js'
import reportRoutes from './routes/ReportRoute.js'
//import loyaltyRoutes from './routes/LoyaltyRoute.js'




// configure

dotenv.config();

//db
connectDB();
//
const  app =express();

//morgan
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))


//routes

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use('/api/v1/product' ,productRoutes);
app.use('/api/v1/report' ,reportRoutes);
//app.use('/api/v1/loyalty', loyaltyRoutes);


//rest api



app.get('/', (req,res)=>{
res.send('<h1>Welcome to Restraunt App</h1>');

});

const PORT = process.env.PORT;

//LISTEN

app.listen(PORT, () =>{

    console.log('SERVER RUNNING ON PORT '+PORT);
})