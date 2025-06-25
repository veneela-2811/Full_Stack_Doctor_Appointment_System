import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import dotenv from 'dotenv'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
dotenv.config()
connectCloudinary();


//app config

const app=express()
const port=process.env.PORT || 4000
connectDB()

//middlewares
app.use(express.json())
app.use(cors()) //allows frontend to connect with the backend

//api endpoints
//localhost:4000/api/admin
app.use('/api/admin',adminRouter)

app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>console.log("Server Started",port))

//config folder-to create multiple configuration files
//controllers folder-multiple functions which will be used as main logic for api
//custom middleware to authenticate users and other purposes