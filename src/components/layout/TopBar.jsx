import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineFoodBank } from 'react-icons/md'

function TopBar() {
    return (
        <nav className='navbar shadow-lg bg-neutral text-neutral-content font-jost flex justify-center align-middle fixed top-0 z-50'>
            <MdOutlineFoodBank className='inline pr-2 text-4xl'/>
            <Link to="/" className='text-3xl font-bold align-middle'>
                Mi Gusta
            </Link>
        </nav>
      )
}

export default TopBar