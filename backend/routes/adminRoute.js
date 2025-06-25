import express from 'express'
import { addDoctor,allDoctors,loginAdmin} from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'


const adminRouter = express.Router()
//using this we can create multiple end points

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
//add authadmin middleware to authenticate admin to access this API
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)

//when a client sends a POST request to this URL (with an image in form-data), multer will process the image and the addDoctor function will be called.


export default adminRouter
