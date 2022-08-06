
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners';

import RecipeItem from './RecipeItem';

function RecipeList() {

    const [ recipes, setRecipes] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // get reference to collection
                const recipesRef = collection(db, 'recipes')

                // create a query
                const q = query(
                    recipesRef,
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
                setLoading(false)
            } catch (e) {
                console.log(e)
                toast.error('Could not fetch recipes')
            }
        }
        fetchRecipes()
    }, []);

    if(loading){
        return  <div class="flex justify-center items-center h-screen">
                    <MoonLoader/>
                </div>
    }

    return (
        <div className='grid gap-4 grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
            {recipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe.data} id={recipe.id}/>
            ))}
        </div>
    )
}

export default RecipeList