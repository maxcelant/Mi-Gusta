import { Link } from 'react-router-dom'
import { AnimationWrapper } from 'react-hover-animation'

function RecipeItem({recipe: { name, teaser,  author, votes, imageUrls, tags, userRef }, id}) {
    
    
    // <Link className='text-base-content text-opacity-40' to={`/users/${login}`}>Visit Profile</Link>
    return (
        <AnimationWrapper>
            <Link to={`/recipe/${userRef}/${id}`}> {/* sends user to individual recipe page */}
                <div className="card bg-base-100 shadow-xl">
                    <figure className="object-fill"><img className="object-fill" src={imageUrls[0]} alt={name} /></figure>
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
            </Link>
        </AnimationWrapper>
        )
    }

export default RecipeItem
