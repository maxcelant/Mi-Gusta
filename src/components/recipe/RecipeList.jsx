import { recipes } from '../../database/recipes';
import RecipeItem from './RecipeItem';

function RecipeList() {
    
    return (
        <div className='grid grid-cols-1 gap-20 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
            {recipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe}/>
            ))}
        </div>
    )
}

export default RecipeList