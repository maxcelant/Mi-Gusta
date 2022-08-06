import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineFoodBank } from 'react-icons/md'

function TopBar() {
    return (
        <nav className='navbar shadow-lg bg-neutral text-neutral-content font-jost'>
          <div className="container mx-auto">
            <div className="flex-none px-2 mx-2">
            <div className='flex justify-center align-middle'>
                <MdOutlineFoodBank className='inline pr-2 text-4xl'/>
                <Link to="/" className='text-3xl font-bold align-middle'>
                    Mi Gusta
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )
}

export default TopBar