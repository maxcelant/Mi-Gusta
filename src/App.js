import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Recipe from './pages/Recipe';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col justify-between h-screen'>
        <Navbar/>
        <main className='container mx-auto px-3 pb-12'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/recipe/:name' element={<Recipe/>}/>
            <Route path='/*' element={<NotFound/>}/>
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
