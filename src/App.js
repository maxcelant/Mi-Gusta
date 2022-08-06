import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, Fragment} from 'react'
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Recipe from './pages/Recipe';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Search from './pages/Search';
import PrivateRoute from './components/PrivateRoute';
import TopBar from './components/layout/TopBar';

function App() {

  return (
    <Fragment>
    <BrowserRouter>
      <div className={'flex flex-col h-screen'}>
      <TopBar/>
      <main className='container mx-auto px-3 pb-12 mt-10'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/profile' element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path='/recipe/:id' element={<Recipe/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
      <Navbar />
      </main>
      </div>
    </BrowserRouter>
    <ToastContainer/>
    </Fragment>
  );
}

export default App;
