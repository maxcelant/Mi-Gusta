import { MdFoodBank } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt } from 'react-icons/fa'
import { MdAccountCircle } from 'react-icons/md'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom'

import { useAuthStatus } from '../../hooks/useAuthStatus';

function Navbar() {

    const { loggedIn } = useAuthStatus()

    const navigate = useNavigate()

    const changePage = (route) => {
      navigate(route)
    }

    return (
      <Fragment>
        <div className="btm-nav">
        <button onClick={() => navigate('/')}>
          <FaHome className='text-4xl'/>
        </button>
        <button onClick={() => navigate('/search')}>
          <BsSearch className='text-4xl'/>
        </button>
        <button onClick={() => navigate('/create-recipe')}>
          <AiOutlinePlusCircle className='text-4xl'/>
        </button>
        <button  onClick={() => navigate('/profile')}>
          <MdAccountCircle className='text-4xl'/>
        </button>
      </div>
    </Fragment>
    )
}

export default Navbar