import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
    name:'',
    teaser: '',
    description: '',
    tags: '',
    votes: 0,
    images: {},
    prep_time: '',
    cook_time: '',
}

function CreateRecipe() {

  const [loading, setLoading] = useState(false)
  const [ingredientList, setIngredientList] = useState([''])
  const [directionList, setDirectionList] = useState([''])
  const [recipeData, setRecipeData] = useState(initialState)
  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if(isMounted){
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setRecipeData({...recipeData, userRef: user.uid, author:user.displayName}) // add user id and name to new recipe
            } else {
                navigate('/signin')
            }
        })
    }
    return () => {
        isMounted.current = false
    }
  }, [isMounted])

  const handleIngredientAdd = (e) => {
    e.preventDefault()
    setIngredientList([...ingredientList, ''])
  }

  const handleIngredientRemove = (e, index) => {
    e.preventDefault()
    const list = [...ingredientList]
    list.splice(index, 1)
    setIngredientList(list)
  }

  const handleIngredientChange = (e, index) => {
    const list = [...ingredientList]
    list[index] = e.target.value
    setIngredientList(list)
  }

  const handleDirectionAdd = (e) => {
    e.preventDefault()
    setDirectionList([...directionList, ''])
  }

  const handleDirectionRemove = (e, index) => {
    e.preventDefault()
    const list = [...directionList]
    list.splice(index, 1)
    setDirectionList(list)
  }

  const handleDirectionChange = (e, index) => {
    const list = [...directionList]
    list[index] = e.target.value
    setDirectionList(list)
  }
  
  const onChange = (e) => {
    setRecipeData({
        ...recipeData,
        [e.target.id]:e.target.value
    })
  }

  const onChangeImages = (e) => {
    setRecipeData((prevState) => ({
        ...prevState,
        images: e.target.files
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if(recipeData.images.length > 6){
        setLoading(false)
        toast.error('Cannot have more than 6 images')
        return
    }

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage() // get storage similar to auth
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}` // create image name
            const storageRef = ref(storage, 'image/' + fileName) // reference to where it will be stored
            const uploadTask = uploadBytesResumable(storageRef, image) // upload the image

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  console.log('Upload is ' + progress + '% done')
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused')
                      break
                    case 'running':
                      console.log('Upload is running')
                      break
                    default:
                      break
                  }
                },
                (error) => {
                  reject(error)
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                  })
                }
              )
        })
    }

    const imageUrls = await Promise.all( 
        [...recipeData.images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded')
        return
    })

    const ingredientListCopy = [...ingredientList]
    const directionListCopy = [...directionList]

    const recipeDataCopy = {
        ...recipeData,
        imageUrls,
        ingredients: ingredientListCopy,
        directions: directionListCopy,
        timestamp: serverTimestamp()
    }
    delete recipeDataCopy.images
    const docRef = await addDoc(collection(db, 'recipes'), recipeDataCopy)
    setLoading(false)
    toast.success('New Recipe Created!')
    navigate(`/recipe/${auth.currentUser.uid}/${docRef.id}`)
  } 

  if(loading){
    return  <div class="flex justify-center items-center h-screen">
                <MoonLoader/>
            </div>
  }

  return (
    <div className='container mx-auto max-w-xl'>
        <div className='text-5xl font-jost font-bold mt-4 mb-4'>Create a Recipe</div>
        <div className='container mx-auto bg-white rounded-md max-w-xl shadow-md p-3'>
            <form>
                <div className='font-jost mt-4 font-semibold text-lg'>Recipe Title</div>
                <input type="text" id='name' value={recipeData.name} onChange={onChange} maxLength='50' minLength='4' required placeholder="tikka masala" className="input w-full" autoComplete="off"/>
                <div className='font-jost mt-4 font-semibold text-lg'>Subtitle</div>
                <input type="text" id='teaser' value={recipeData.teaser} onChange={onChange} maxLength='150' minLength='4' required placeholder="delicious indian recipe..." className="input w-full" autoComplete="off"/>
                <div className='font-jost mt-4 font-semibold text-lg'>Description</div>
                <textarea type="text" id='description' value={recipeData.description} onChange={onChange} maxLength='1500' minLength='30' required placeholder="This rich and creamy tikka rivals any indian restaurant..." className="input w-full min-h-64" autoComplete="off"/>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='container'>
                    <div className='font-jost mt-4 font-semibold text-lg text-center'>Prep Time</div>
                    <input type="text" id='prep_time' value={recipeData.prep_time} onChange={onChange} maxLength='30' minLength='1' required placeholder="5 minutes" className="input w-full" autoComplete="off"/>
                  </div>
                  <div className='container'>
                    <div className='font-jost mt-4 font-semibold text-lg text-center'>Cook Time</div>
                    <input type="text" id='cook_time' value={recipeData.cook_time} onChange={onChange} maxLength='30' minLength='1' required placeholder="25 minutes" className="input w-full" autoComplete="off"/>
                  </div>
                </div>
                <div className='font-jost mt-4 font-semibold text-lg mr-4'>Step-by-Step Instructions</div>
                <div className='mt-1'><button onClick={handleDirectionAdd} className='btn btn-sm btn-success rounded-lg mr-2 btn-outline border-4'>Add Step</button></div>
                { directionList.map((direction, index) => (
                    <span key={index} className='relative'>
                        <textarea type="text" id='ingredient' value={direction} onChange={(e) => handleDirectionChange(e, index)} maxLength='500' minLength='3' required placeholder={`Step ${index+1}`} className="input w-full min-h-64 mt-3" autoComplete="off"/>
                        {directionList.length > 1 && <button onClick={(e) => handleDirectionRemove(e, index)} className='absolute btn btn-sm btn-error rounded-lg btn-outline border-4 bottom-2 right-2'>Remove</button>}
                    </span>
                ))
                }
                <div className='font-jost mt-4 font-semibold text-lg mr-4'>Ingredients</div>
                <div className='mt-1'><button onClick={handleIngredientAdd} className='btn btn-sm btn-success rounded-lg mr-2 btn-outline border-4'>Add Ingredient</button></div>
                { ingredientList.map((ingredient, index) => (
                    <span key={index} className='relative'>
                        <input type="text" id='ingredient' value={ingredient} onChange={(e) => handleIngredientChange(e, index)} maxLength='80' minLength='3' required placeholder="1 teaspoon of turmeric" className="input w-full min-h-64 mt-3" autoComplete="off"/>
                        {ingredientList.length > 1 && <button onClick={(e) => handleIngredientRemove(e, index)} className='absolute btn btn-sm btn-error rounded-lg btn-outline border-4 -bottom-1 right-2'>Remove</button>}
                    </span>
                ))
                }
                <div className='font-jost mt-4 font-semibold text-lg mr-4'>Add Images (Max of 6)</div>
                <input className="formInputFile" type='file' id='images' onChange={onChangeImages} max='6' accept='.jpg,.png,.jpeg' multiple required/>
                <div className='border-t border-gray-300 border-1 my-6'/>
                <div className='flex justify-center'>
                    <button className='btn btn-wide btn-primary rounded-lg shadow-lg mb-4' onClick={onSubmit}>Create Recipe</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateRecipe