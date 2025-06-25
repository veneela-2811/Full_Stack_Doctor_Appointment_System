import { assets } from '@/assets/assets'
import React from 'react'

const Contact = () => {


  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 '><p>CONTACT <span>US</span></p></div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-center gap-6'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>4709 Willms Station<br/>Suite 350, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555‑0132<br/>Email: greatstackdev@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'><b>Careers at PRESCRIPTO</b></p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-4 py-2 text-sm hover:bg-black hover:text-white  transition-all duration-500'>Explore Jobs</button>


        </div>
      </div>
    </div>
  )
}

export default Contact