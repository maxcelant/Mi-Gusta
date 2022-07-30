import { Link } from 'react-router-dom'
import { AnimationWrapper } from 'react-hover-animation'

function RecipeItem({recipe: { name, description,  author, votes, image, tags }}) {
    
    
    // <Link className='text-base-content text-opacity-40' to={`/users/${login}`}>Visit Profile</Link>
    return (
        <AnimationWrapper>
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure><img src={image} alt="Shoes" /></figure>
                <div class="card-body">
                <h2 class="card-title">{name}</h2>
                <p>{description}</p>
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


    // <div className="flex-row items-center space-x-4 card-body">
    //     <div className="avatar">
    //         <div className="rounded-full shadow w-14 h-14">
    //             <img src={image} alt="Profile" />
    //         </div>
    //     </div>
    //     <div className="card-title">{name}</div>
    //     <div className="">{author}</div>
    // </div>