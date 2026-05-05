import React from 'react'
import {TbBrandMeta} from "react-icons/tb" ;
import {IoLogoInstagram} from "react-icons/io" ;
import {RiTwitterXLine} from "react-icons/ri" ;

const TopBar = () => {
  return (
    <div className='bg-sitColor text-white'>
        <div className='container mx-auto flex justify-between items-center px-4 py-3'>
            <div className='hidden md:flex items-center space-x-4'>
                <a href="#" className='hover:text-gray-300'>
                    <TbBrandMeta className='h-5 w-5'/>
                </a>                                                      
                <a href="#" className='hover:text-gray-300'>
                    <IoLogoInstagram className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <RiTwitterXLine className='h-5 w-5'/>
                </a>
            </div>
            <div className='text-sm text-center'>
                <span>We Ship WorldWide - Fast and Reliable Shipping!</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel: +1234567890" className='hover:text-gray-300'>+1 (234) 567-890</a>
            </div>
        </div>      
    </div>
  )
}

export default TopBar
