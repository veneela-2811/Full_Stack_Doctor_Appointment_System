//API logic for the users to login,register,book/cancel appointment,update profiles,payment gateways
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import razorpay from 'razorpay'

//API controller function to register user

//Async arrow function
const registerUser = async (req,res)=>{
    try {

        const {name,email,password}=req.body

        if(!name || !email || !password ){
            return res.json({success:false,message:"Missing Details"})
        }

        //validate the email
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Incorrect email"})

        }
        

        //password length checking
        if(password.length<8){
            return res.json({success:false,message:"enter a strong password"})

        }

        //add the user in the database using bcrypt after all checkings
        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        //details from userModel.js
        const userData={
            name,
            email,
            password:hashedPassword
        }

        //save the hashed password in the database

        const newUser=new userModel(userData)
        const user=await newUser.save()

        //we'll get an ID from the  user object above  through which we will create a token for user to login on the website

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true,token})
        
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})     
    }
}

//using this func we'll create a route in userRoute.js


//API for user Login
const loginUser=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})

        //check if user exists with that email id provided or not
        if(!user){
             return res.json({success:false,message:'User does not exist'})     
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        } else{
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})     
        
    }
    //export this fun
}

//controller function to get user's profile data

//API to get user profile data
const getProfile=async(req,res)=>{

    try {
        const userId=req.userId
        //to change header into userid,we need to use a middleware called authuser.js
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})    
        
    }

}

//API to update user profile
const updateProfile=async (req,res)=>{
    try {
        //we will get userid from middleware
        const userId=req.userId
        const {name,phone,address,dob,gender}=req.body          //we will get userid from middleware
        const imageFile=req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"data missing"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        //if we have img file,we will save it in cloudinary and URL will be saved in user's image data property
        
        if(imageFile){
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile Uploaded"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})  
        
    }

}

//API To book appointment with the doctor
 
const bookAppointment=async (req,res)=>{

    try {
        const {docId,slotDate,slotTime}=req.body

        const userId = req.userId; // from middleware
       
        //getting doc data using doctor Id

        const docData=await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'})
        }

        let slots_booked=docData.slots_booked

        // Checking for slots availability
        if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:'Slot not available'})
        } else{
            slots_booked[slotDate].push(slotTime)
        }
        } else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        
        const userData=await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppointment=new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Booked'})
        
    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API to get user appointments for frontend my-appointments - list of appointments user has booked

const listAppointment=async (req,res)=>{
    try {

        const userId=req.userId

        //var to store all the appointments of the user

        const appointments=await appointmentModel.find({userId})
        res.json({success:true,appointments})
        
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }



}



//api to cancel appointment

const cancelAppointment=async (req,res)=>{
    try {
        const {appointmentId}=req.body
        const userId=req.userId
        const appointmentData=await appointmentModel.findById(appointmentId)

        //Verify appointment user

        if(appointmentData.userId.toString() !== userId){
            return res.json({success:false,message:'Unauthorized action'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot
        const {docId,slotDate,slotTime}=appointmentData

        const doctorData=await doctorModel.findById(docId)

        let slots_booked=doctorData.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Cancelled'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay

const paymentRazorpay=async (req,res)=>{

    try {
        const {appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)
    
    //if appointment is not booked or it is cancelled,we can't pay 
    if(!appointmentData || appointmentData.cancelled){
        return res.json({success:false,message:"Appointment cancelled or not found"})
    }

    //Creating options for razorpay payment

    const options={
        amount:appointmentData.amount*100,
        currency:process.env.CURRENCY,
        receipt:appointmentId,
    }

    // creation of an order
    const order=await razorpayInstance.orders.create(options)

    res.json({success:true,order})

}



        
    catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API to verify payment of razorpay

const verifyRazorpay=async (req,res)=>{
    try {

        const {razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log(orderInfo)
        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"Payment Successful"})
            
        } else{
            res.json({success:false,message:"Payment Failed"})

        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}
   
export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}


