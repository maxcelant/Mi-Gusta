import { Link } from 'react-router-dom'
import { AnimationWrapper } from 'react-hover-animation'

function RecipeItem({recipe: { name, teaser,  author, votes, imageUrls, tags, userRef }, id}) {
   
    
    // <Link className='text-base-content text-opacity-40' to={`/users/${login}`}>Visit Profile</Link>
    return (
        <AnimationWrapper>
            <Link to={`/recipe/${userRef}/${id}`}> {/* sends user to individual recipe page */}
                <div className="card bg-base-100 shadow-xl relative">
                    <figure className="object-cover"><img className="w-full object-cover max-h-72" src={imageUrls[0]} alt={name} /></figure>
                    <div class="card-body">
                    <h2 class="card-title">{name}</h2>
                    <div className='badge'>{author}</div>
                    <p className='overflow-hidden max-h-24'>{teaser}</p>
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
