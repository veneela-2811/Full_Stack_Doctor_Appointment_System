import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import React, { useContext, useState } from 'react'
import { AppContext } from '@/context/AppContext.jsx';



const Navbar = () => {
    const navigate=useNavigate();

    const [showMenu,setShowMenu]=useState(false);

    const {token,setToken,userData}=useContext(AppContext)

    const logout =()=>{
      setToken(false)
      localStorage.removeItem('token')

    }
   
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
        
            <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
            </NavLink>

            <NavLink to='/doctors'>
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/> 
            </NavLink>

            <NavLink to='/about'>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>  
            </NavLink>

            <NavLink to='/contact'>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>  
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'> 
            {
                token && userData
                ?<div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full'  src={userData.image} alt="" />
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                    <div>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>   
            } 
            <img onClick={()=>setShowMenu(true)}className='w-6 md:hidden' src={assets.menu_icon} alt="" />   




            {/* ----------------------MOBILE MENU------------------------- */}
            <div className={` ${showMenu? 'fixed w-full' :'h-0 w-0'} md:hidden right-0 bottom-0 top-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>

    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>

    <NavLink 
    onClick={() => setShowMenu(false)} 
    to='/' 
    className={({ isActive }) =>
      `px-4 py-2 rounded inline-block ${isActive ? 'text-white bg-[#5f6FFF]' : ''}`
    }
  >
    HOME
  </NavLink>

  <NavLink 
    onClick={() => setShowMenu(false)} 
    to='/doctors' 
    className={({ isActive }) =>
      `px-4 py-2 rounded inline-block ${isActive ? 'text-white bg-[#5f6FFF]' : ''}`
    }
  >
    ALL DOCTORS
  </NavLink>

  <NavLink 
    onClick={() => setShowMenu(false)} 
    to='/about' 
    className={({ isActive }) =>
      `px-4 py-2 rounded inline-block ${isActive ? 'text-white bg-[#5f6FFF]' : ''}`
    }
  >
    ABOUT
  </NavLink>

  <NavLink 
    onClick={() => setShowMenu(false)} 
    to='/contact' 
    className={({ isActive }) =>
      `px-4 py-2 rounded inline-block ${isActive ? 'text-white bg-[#5f6FFF]' : ''}`
    }
  >
    CONTACT
  </NavLink>
  </ul>


            </div>
        </div>
    </div>
    
  );
}

export default Navbar