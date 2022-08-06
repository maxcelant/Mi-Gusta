import { Link } from 'react-router-dom'
import { AnimationWrapper } from 'react-hover-animation'

function RecipeItem({recipe: { name, teaser,  author, votes, image, tags }}) {
    
    
    // <Link className='text-base-content text-opacity-40' to={`/users/${login}`}>Visit Profile</Link>
    return (
        <AnimationWrapper>
            <div className="card bg-base-100 shadow-xl min-h-full m-3">
                <figure className="object-fill"><img className="object-fill" src={image} alt="Shoes" /></figure>
                <div class="card-body">
                <h2 class="card-title">{name}</h2>
                <div className='badge'>{author}</div>
                <p>{teaser}</p>
                <div class="card-actions justify-end">
                    { tags.map((tag) => (
                        <span class="badge badge-outline">#{tag}</span>
                    ))}
                </div>
                </div>
            </div>
        </AnimationWrapper>
        )
    }

export default RecipeItem
