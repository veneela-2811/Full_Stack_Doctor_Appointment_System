// import React, { useState, useContext } from 'react';
// import { AdminContext } from '../context/AdminContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';


// const Login = () => {
//   const [state, setState] = useState('Admin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setAToken, backendUrl } = useContext(AdminContext);


//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     try {
//       if (state === 'Admin') {
//         const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
//           email,
//           password,
//         });
//         if (data.success) {
//           localStorage.setItem('aToken', data.token);
//           setAToken(data.token);
          
         
          
//         } else {
//           toast.error(data.message)
//         }
//       } else {
//         alert('Doctor login not implemented yet.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className='min-h-[80vh] flex items-center justify-center bg-gray-50'
//     >
//       <div className='flex flex-col gap-4 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
//         <p className='text-lg font-semibold text-center w-full'>
//           <span className='text-green-600'>{state}</span> Login
//         </p>

//         <div className='w-full'>
//           <p className='mb-1 font-medium'>Email</p>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             type='email'
//             required
//             placeholder='Enter your email'
//             className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
//           />
//         </div>

//         <div className='w-full'>
//           <p className='mb-1 font-medium'>Password</p>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             type='password'
//             required
//             placeholder='Enter your password'
//             className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400'
//           />
//         </div>

//         <button
//           type='submit'
//           className='mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
//         >
//           Login
//         </button>

//         <p className='text-center w-full'>
//           {state === 'Admin' ? (
//             <>Doctor Login?{' '}
//               <span
//                 className='text-green-600 underline cursor-pointer'
//                 onClick={() => setState('Doctor')}
//               >
//                 Click Here
//               </span>
//             </>
//           ) : (
//             <>Admin Login?{' '}
//               <span
//                 className='text-green-600 underline cursor-pointer'
//                 onClick={() => setState('Admin')}
//               >
//                 Click Here
//               </span>
//             </>
//           )}
//         </p>
//       </div>
//     </form>
//   );
// };

// export default Login;



import React, { useContext, useState } from 'react'
import { assets } from '@/assets/assets'
import { AdminContext } from '@/context/AdminContext'
import axios from 'axios'
import {toast} from 'react-toastify'

const Login = () => {

    const [state,setState]=useState('Admin')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')


    //destructure setAToken,backendUrl from the API to use it here

    const {setAToken,backendUrl}=useContext(AdminContext)

    const onSubmitHandler=async (event)=>{
        //when we submit the form,it won't reload the web page
        event.preventDefault()

        try{

            //api call

            if(state==='Admin'){
                //destructure the response from API call
                const {data}=await axios.post(backendUrl + '/api/admin/login',{email,password})
                if(data.success){
                    localStorage.setItem('aToken',data.token)
                    setAToken(data.token)
                }
                else{
                    toast.error(data.message)
                }

            }
            else{

            }

        }
        catch(error){

        }

    }


    





  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto' ><span className='text-[#5F6FFF]'>{state}</span> Login</p>

            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
            </div>

            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
            </div>

            <button type="submit" className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
            {
                state==='Admin'
                ?<p>Doctor Login?<span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Doctor')}> Click Here</span></p>
                :<p>Admin Login?<span  className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Admin')}> Click Here</span></p>
            }
        </div>
    </form>
  )
}

export default Login