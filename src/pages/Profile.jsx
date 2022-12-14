import { useState, useEffect, useRef } from 'react'
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { MoonLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid' 

function Profile() {

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  const [ percent, setPercent ] = useState(0)
  const [ file, setFile ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ userData, setUserData ] = useState(null)
  const [ changeDetails, setChangeDetails ] = useState(false)

  useEffect(() => {
    if(isMounted){
      const fetchUser = async () => {
          try {
            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
              setUserData(docSnap.data())
              setLoading(false)
            }
          } catch (e) {
            toast.error('Could not fetch profile. Check internet connection.')
          }
        }
        
        fetchUser()
    }
    return () => {
      isMounted.current = false
  }
  }, [isMounted])

  const onChange = (e) => {
    setUserData({...userData, [e.target.id]: e.target.value})
  }

  const onChangeAvatar = (e) => {
    setFile(e.target.files[0])
  }

  const onSubmitAvatar = async (e) => {
    e.preventDefault()

    if(!file){
      toast.error('File not uploaded')
      return
    }
    
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${file.name}-${uuidv4()}`
        const storageRef = ref(storage, 'image/' + fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
              const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setPercent(percent);
          },
          (err) => {
            reject(err)
          },
          () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                  resolve(url)
              });
            }
        );
      })
    }

    let fileURL = await storeImage(file)

    setUserData({
      ...userData,
      avatar: fileURL
    })

    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, userData)

    setLoading(false)
    toast.success('Successfully updated avatar!')
  }

  const onSubmit = async (e) => {
    try {
      if(auth.currentUser.displayName !== userData.name){
        // update display name in Firebase Authentication
        await updateProfile(auth.currentUser, {
          displayName: userData.name
        });

        // update user in Firestore
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
      })
      toast.success('Successfully updated!')
    } catch (e) {
      toast.error('Could not update profile details')
    }
  }

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }

  if(loading){
    return  <div className="flex justify-center items-center h-screen">
                <MoonLoader/>
            </div>
  }

  return (
    <div className='container mx-auto min-w-lg'>
        <div className="flex justify-end">
            <button onClick={onLogOut} className='btn btn-sm btn-primary rounded-2xl shadow-md'>Logout</button>
        </div>
        <div className='text-5xl font-jost font-bold mb-6'>My Profile</div>
        <div className='container mx-auto flex justify-start items-center mb-3'>
        <div className="avatar relative">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg">
              <img src={userData.avatar} alt={userData.name}/>
            </div>
        </div>
        <label htmlFor="my-modal" class="absolute btn btn-lg modal-button bg-transparent text-transparent border-0 hover:bg-transparent rounded-full">ope</label>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Profile Avatar</h3>
            <input className="formInputFile" type='file' id='images' onChange={onChangeAvatar} max='1' accept='.jpg,.png,.jpeg' required/>
            <div className="modal-action">
              <label htmlFor="my-modal" onClick={onSubmitAvatar} className="btn btn-sm">Update</label>
              <label htmlFor="my-modal" className="btn btn-sm btn-secondary">Cancel</label>
            </div>
          </div>
        </div>
        <div className='flex justify-start font-bold text-md ml-3 font-jost'>
          {userData.name}
        </div>
        </div>
        <div className='font-thin text-xl mb-2 font-mukta'>Personal Details</div>
        <div className='grid lg:grid-cols-2'>
            <div className='container bg-white rounded-lg min-w-md p-5 shadow-lg'>
                <div className='flex justify-end'>
                    <button className='btn btn-xs btn-secondary font-bold rounded-2xl' onClick={() => {
                      changeDetails && onSubmit();
                      setChangeDetails(!changeDetails);
                    }}>
                        {changeDetails ? 'Finish' :'Edit Account'}
                    </button>
                </div>
                <form>
                  <div className='font-semibold pr-5'>
                    name <input type="text" id="name" disabled={!changeDetails} value={userData.name} onChange={onChange} className={changeDetails ? 'p-2 text-md font-thin bg-secondary rounded-md w-full' : 'text-md font-thin w-full'}></input>
                  </div>
                  <div className='font-semibold pr-5'>
                    email <input type="text" id="email" disabled={!changeDetails} value={userData.email} onChange={onChange} className={changeDetails ? 'p-2 text-md font-thin bg-secondary rounded-md w-full' : 'text-md font-thin w-full'}></input>
                  </div>
                  <div className='font-semibold pr-5'>
                    bio <textarea type="text" id="bio" disabled={!changeDetails} value={userData.bio} onChange={onChange} className={changeDetails ? 'p-2 text-md font-thin bg-secondary rounded-md w-full' : 'text-md font-thin w-full'}></textarea>
                  </div>
                </form>
            </div>
        </div>
        <Link to={`/account/${auth.currentUser.uid}`}>
          <button className='btn btn-md btn-primary rounded-full mt-3'>Check out my Page</button>
        </Link>
    </div>
  )
}

export default Profile