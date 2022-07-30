import { MdFoodBank } from 'react-icons/md';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className='navbar mb-12 shadow-lg bg-neutral text-neutral-content'>
          <div className="container mx-auto">
            <div className="flex-none px-2 mx-2">
              <MdFoodBank className='inline pr-2 text-5xl'/>
              <Link to="/" className='text-2xl font-bold font-jost align-middle'>
                Mi Gusta
              </Link>
            </div>
            <div className="flex-1 px-2 mx-2">
              <div className="flex justify-end">
                <Link to="/" className="btn btn-ghost btn-sm btn-rounded">Home</Link>
                <Link to="/about" className="btn btn-ghost btn-sm btn-rounded">About</Link>
              </div>
            </div>
          </div>
        </nav>
      )
}

export default Navbar