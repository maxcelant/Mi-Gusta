import { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

function Profile() {

  const auth = getAuth()
  const navigate = useNavigate()

  const [ userData, setUserData ] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }


  return (
    <div className='container mx-auto min-w-lg'>
        <div className="flex justify-end">
            <button onClick={onLogOut}className='btn btn-sm btn-primary rounded-2xl shadow-md'>Logout</button>
        </div>
        <div className='flex'>
            <div className='justify-start text-4xl font-bold pb-6'>My Profile</div>
        </div>
        <div className='font-thin text-xl mb-2'>Personal Details</div>
        <div className='grid lg:grid-cols-2'>
            <div className='container bg-white rounded-lg min-w-md p-5 shadow-lg'>
                <div className='flex justify-end'>
                    <button className='btn btn-xs btn-secondary font-bold rounded-2xl'>Edit Account</button>
                </div>
                <div className='text-xl font-bold'>{userData.name}</div>
                <div className='text-xl font-semibold'>{userData.email}</div>
            </div>
        </div>
    </div>
  )
}

export default Profile