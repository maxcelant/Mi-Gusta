import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { MoonLoader } from 'react-spinners';

const PrivateRoute = () => {

  const { loggedIn, checkingStatus } = useAuthStatus();

  if(checkingStatus){
    return <MoonLoader/>
  }

  // Outlet is means go to the nested child route 
  return loggedIn ? <Outlet/> : <Navigate to='/signin'/>
}

export default PrivateRoute