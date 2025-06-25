import {createContext, useEffect, useState} from "react";
// import { doctors } from "@/assets/assets";
import axios from "axios";
import {toast} from 'react-toastify'


export const AppContext=createContext();

const AppContextProvider=(props)=>{

    const currencySymbol='$'
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors]=useState([])

    //state variable to store user authentication token
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

    //State variable to store user's data 
    const [userData,setUserData]=useState(false)


  
    const getDoctorsData= async ()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            } else{
                toast.error(data.message)

            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    //API to integrate get profile and update profile to frontend
    const loadUserProfileData=async()=>{
        try {
            //to recieve user's profile data
            const {data}=await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            } else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

      const value={
        doctors,
        getDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData
    }


    useEffect(()=>{
        getDoctorsData()

    },[])

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        } else{
            setUserData(false)

        }
    },[token])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider