import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { AiOutlineSearch } from 'react-icons/ai'
import { db } from '../firebase.config'
import Fuse from 'fuse.js'
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners'

function Search() {

  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchOutput, setSearchOutput] = useState(null)
  const [recipes, setRecipes] = useState({
    name: '',
    author: '',
    cook_time: '',
    prep_time: '',
  })
  const isMounted = useRef(true)

  useEffect(() => {
    if(isMounted){
        const fetchRecipes = async () => {
            try {
                // get reference to collection
                const recipesRef = collection(db, 'recipes')

                // create a query
                const q = query(
                    recipesRef,
                    orderBy('timestamp', 'desc'),
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
                setLoading(false)
            } catch (e) {
                console.log(e)
                toast.error('Could not fetch recipes')
            }
        }
        fetchRecipes()
    }
    return () => {
        isMounted.current = false
    }
}, [isMounted]);

  const fuse = new Fuse(recipes, {
    keys: ['data.author', 'data.cook_time', 'data.name', 'data.prep_time']
  })

  const onChange = (e) => {
    setSearchInput(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSearchOutput(fuse.search(searchInput))
  }

  if(loading){
    return  <div class="flex justify-center items-center h-screen">
                <MoonLoader/>
            </div>
  }

  return (
    <div>
      <div className='container mx-auto border-1 border-slate-400 max-w-md rounded-md'>
        <form className='relative'>
            <input type="text" id='prep_time' value={searchInput} onChange={onChange} maxLength='30' minLength='1' required placeholder="Search" className="input min-w-full border-2 border-stone-400 bg-white" autoComplete="off"/>
            <button className='absolute btn btn-md rounded-full -right-1 btn-ghost hover:bg-transparent' onClick={onSubmit}><AiOutlineSearch className='text-3xl'/></button>
        </form>
      </div>
      <div className='mt-4 mb-10'>
        { searchOutput ? searchOutput.map(({item}, index) => (
          <div key={index} className='flex justify-center'>
          <Link to={`/recipe/${item.userRef}/${item.id}`}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4">
              <img className="w-full max-h-48 md:max-h-72 lg:max-h-72 object-cover" src={item.data.imageUrls[0]} alt={item.data.name}/>
              <div className="px-4 py-2">
                  <div className='absolute top-3 left-3 badge badge-primary font-jost bg-opacity-70'>{item.data.author}</div>
                  <div className="font-bold text-md font-poppins">{item.data.name}</div>
                  <div className="font-medium text-sm font-poppins">{item.data.teaser}</div>
              </div>
              </div>
          </Link>
          </div>
        )) : recipes.map((recipe, index) => (
          <div key={index} className='flex justify-center'>
          <Link to={`/recipe/${recipe.data.userRef}/${recipe.id}`}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4 relative">
              <img className="w-full max-h-48 md:max-h-72 lg:max-h-72 object-cover" src={recipe.data.imageUrls[0]} alt={recipe.data.name}/>
              <div className="px-4 py-2">
                  <div className='absolute top-3 left-3 badge badge-primary font-jost bg-opacity-70'>{recipe.data.author}</div>
                  <div className="font-bold text-md font-poppins">{recipe.data.name}</div>
                  <div className="font-medium text-sm font-poppins">{recipe.data.teaser}</div>
              </div>
              </div>
          </Link>
          </div>
      ))
        }
      </div>
    </div>
  )
}

export default Search