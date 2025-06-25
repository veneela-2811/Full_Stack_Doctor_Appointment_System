import express from 'express'
import {registerUser,loginUser, getProfile, updateProfile,bookAppointment, listAppointment,cancelAppointment,paymentRazorpay, verifyRazorpay} from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter=express.Router()
//api end points
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
//we use authUser as middleware to get userId from authUser.js
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default userRouter

//we'll use this userRouter in server.js file and can check in postman using api/user/register
