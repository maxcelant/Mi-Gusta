import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { getDoc, doc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { MoonLoader } from 'react-spinners'
import { toast } from 'react-toastify' 


function Account() {
  
  const [ user, setUser ] = useState(null)
  const [ recipes, setRecipes ] = useState(null)
  const [ loadingUser, setLoadingUser ] = useState(true)
  const [ loadingRecipe, setLoadingRecipe ] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchRecipes = async () => {
        try {
            // get reference to collection
            const recipesRef = collection(db, 'recipes')

            // create a query
            const q = query(
                recipesRef,
                where('userRef', '==', params.userId),
                orderBy('timestamp', 'desc'),
                limit(20),
            )

            // execute query
            const querySnap = await getDocs(q)

            const recipes = []

            querySnap.forEach((doc) => {
                return recipes.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setRecipes(recipes)
            setLoadingRecipe(false)
        } catch (e) {
            console.log(e)
            toast.error('Could not fetch recipes')
        }
    }

    const fetchUser = async () => {
        try {
          const docRef = doc(db, 'users', params.userId)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
            setUser(docSnap.data())
            setLoadingUser(false)
          }
        } catch (e) {
          toast.error('Could not fetch recipe')
        }
      }
      
      fetchUser()
      fetchRecipes()
  }, [])

  if(loadingUser || loadingRecipe){
    return  <div class="flex justify-center items-center h-screen">
                <MoonLoader/>
            </div>
  }
  
  return (
    <div>
        <div className='container mx-auto flex justify-start items-center mb-3'>
        <div class="avatar">
            <div  class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg">
            <img src={user.avatar} alt={user.name}/>
            </div>
        </div>
        <div className='flex justify-start font-bold text-md ml-3'>{user.name}</div>
        </div>
        <div className='font-thin text-sm md:text-md lg:text-md xl:text-lg italic'>{user.bio}</div>
        <div className='border-t border-gray-300 my-4'/>
        <div className='font-jost text-2xl font-semibold mb-2'>Posts</div>
        <div className='container mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1'>
                {recipes.map((recipe) => (
                    <Link to={`/recipe/${params.userId}/${recipe.id}`}>
                        <div class="max-w-sm rounded overflow-hidden shadow-lg ">
                        <img class="w-full max-h-48 md:max-h-72 lg:max-h-72 object-cover" src={recipe.data.imageUrls[0]} alt={recipe.data.name}/>
                        <div class="px-4 py-2">
                            <div class="font-bold text-sm font-poppins">{recipe.data.name}</div>
                            <div class="font-medium text-sm font-poppins">{recipe.data.teaser}</div>
                        </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Account