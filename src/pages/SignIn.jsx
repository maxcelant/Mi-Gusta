import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

const initialState = {
  email: '',
  password: ''
}

function SignIn() {

  const [seePassword, setSeePassword] = useState(true)
  const [inItalian, setInItalian] = useState(false)

  const [userData, setUserData] = useState(initialState)
  
  const navigate = useNavigate()

  const onChange = (e) => {
    setUserData({
      ...userData,
      [e.target.id]:e.target.value
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
      if(userCredential.user){
        navigate('/');
      }
    } catch (e) {
      toast.error('Bad User Credentials')
    }
  }

  return (
        <div className='container mx-auto max-w-md bg-white rounded-lg p-10 border-2 relative pb-20 mt-18 xl:mt-32'>
            <form onSubmit={onSubmit}>
            <div className="text-4xl font-bold text-center pb-5 font-jost">Log In</div>
                <div className="flex justify-center">
                <div onClick={() => navigate('/signup')} className='badge badge-secondary font-bold mb-4 cursor-pointer'>{!inItalian ? 'Register Instead' : 'Registrati Invece'}</div>  
                </div>
                <div className='flex justify-center pb-5'>
                <input type="text" placeholder="Email" className="input input-bordered w-full max-w-xs text-center" id='email' value={userData.email} onChange={onChange}/>
                </div>
                <div className='flex justify-center pb-5 relative'>
                <input type={!seePassword ? 'text' : 'password'} placeholder="Password" className="input input-bordered w-full max-w-xs text-center" id='password' value={userData.password} onChange={onChange}/>
                { !seePassword ? (
                    <AiFillEye onClick={() => setSeePassword(!seePassword)}className='absolute right-10 top-3 text-2xl'/>
                ) : (
                    <AiFillEyeInvisible onClick={() => setSeePassword(!seePassword)}className='absolute right-10 top-3 text-2xl'/>
                ) }
                </div>
                <div className='flex justify-center pb-5'>
                <button className='btn btn-wide btn-primary'>{!inItalian ? 'Enter' : 'Accedere'}</button>
                </div>
            </form>
            { !inItalian ? (
                <span className='absolute right-4 font-bold bottom-8 text-center'>ENG</span>

            ) : (
                <span className='absolute right-5 font-bold bottom-8 text-center'>ITA</span>
            ) }
            <input type="checkbox" className="toggle absolute right-2 bottom-2" onClick={() => setInItalian(!inItalian)}/>
        </div>

      
  )
}

export default SignIn