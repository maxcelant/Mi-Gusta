import { useState, useEffect, Fragment } from 'react'
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { MoonLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid' 

function Profile() {

  const auth = getAuth()
  const navigate = useNavigate()

  const [ percent, setPercent ] = useState(0)
  const [ loading, setLoading ] = useState(true)
  const [ userData, setUserData ] = useState(null)
  const [ changeDetails, setChangeDetails ] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
        try {
          const docRef = doc(db, 'users', auth.currentUser.uid)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
            setUserData(docSnap.data())
            setLoading(false)
          }
        } catch (e) {
          toast.error('Could not fetch data')
        }
      }
      
      fetchUser()
  }, [])

  const onChange = (e) => {
    setUserData({...userData, [e.target.id]: e.target.value})
  }

  const onChangeAvatar = (e) => {
    setUserData({
      ...userData,
      file: e.target.files
    })
  }

  const onSubmitAvatar = async (e) => {
    e.preventDefault()

    if(!userData.file){
      toast.error('File not uploaded')
      return
    }

    const storage = getStorage()
    const fileName = `${auth.currentUser.uid}-${userData.file.name}-${uuidv4()}`
    const storageRef = ref(storage, `images/` + fileName)
    const uploadTask = uploadBytesResumable(storageRef, userData.file)

    let fileUrl = '';

    uploadTask.on(
      "state_changed",
      (snapshot) => {
          const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(percent);
      },
      (err) => console.log(err),
      () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              fileUrl = url;
          });
      }
    ); 

    console.log(fileUrl)

    const userDataCopy = {
      ...userData,
      avatar: fileUrl
    }
    delete userDataCopy.file
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, userDataCopy)
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
    return  <div class="flex justify-center items-center h-screen">
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
        <label for="my-modal" class="absolute btn btn-lg modal-button bg-transparent text-transparent border-0 hover:bg-transparent rounded-full">ope</label>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Profile Avatar</h3>
            <input className="formInputFile" type='file' id='images' onChange={onChangeAvatar} max='1' accept='.jpg,.png,.jpeg' required/>
            <div className="modal-action">
              <label for="my-modal" onClick={onSubmitAvatar} className="btn btn-sm">Update</label>
              <label for="my-modal" className="btn btn-sm btn-secondary">Cancel</label>
            </div>
          </div>
        </div>
        <div className='flex justify-start font-bold text-md ml-3'>
          {userData.name}
        </div>
        </div>
        <div className='font-thin text-xl mb-2'>Personal Details</div>
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
    </div>
  )
}

export default Profile