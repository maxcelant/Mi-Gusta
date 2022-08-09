import { Link } from 'react-router-dom'
import { AnimationWrapper } from 'react-hover-animation'
import { useState, useEffect, useRef } from 'react'
import { getDoc, doc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase.config';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function RecipeItem({recipe: { name, teaser,  author, votes, imageUrls, tags, userRef, prep_time}, id}) {
   
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted){
            const fetchUser = async () => {
                try {
                  const docRef = doc(db, 'users', userRef)
                  const docSnap = await getDoc(docRef)
                  if(docSnap.exists()){
                    setUser(docSnap.data())
                    setLoading(false)
                  }
                } catch (e) {
                  toast.error('Could not fetch recipe')
                }
              }
              
              fetchUser()
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted]);


    if(loading){
        return  <div class="flex justify-center items-center h-screen">
                    <MoonLoader/>
                </div>
    }
    
    return (
        <AnimationWrapper>
            <Link to={`/recipe/${userRef}/${id}`}> {/* sends user to individual recipe page */}
                <div className="card bg-base-100 shadow-xl relative">
                    <div class="avatar absolute left-4 top-4">
                        <div  class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-lg">
                            <img src={user.avatar} alt={user.name}/>
                        </div>
                        <span className='flex items-center ml-2 badge badge-secondary mt-3 font-semibold'>{user.name}</span>
                    </div>
                    <figure className="object-cover"><img className="w-full object-cover max-h-72" src={imageUrls[0]} alt={name} /></figure>
                    <div class="card-body">
                    <h2 class="card-title font-poppins">{name}</h2>
                    <div className='badge badge-primary font-semibold font-jost'>{prep_time}</div>
                    <p className='overflow-hidden max-h-24 font-poppins'>{teaser}</p>
                    { tags !== null || tags.length !== 0 && (
                        <div className="card-actions justify-end">
                            { tags.map((tag, index) => (
                                <span key={index} class="badge badge-outline">#{tag}</span>
                            ))}
                        </div>)
                    }
                    </div>
                </div>
            </Link>
        </AnimationWrapper>
        )
    }

export default RecipeItem
