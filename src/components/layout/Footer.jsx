import { GiButterflyFlower } from 'react-icons/gi';

function Footer() {
    const currentDate = new Date().getFullYear();

    return (
      <footer className='footer p-5 bg-neutral text-primary-content footer-center'>
          <div>
              <GiButterflyFlower className='text-4xl'/>
              Created by Massimiliano Celant
              <p>Copyright &copy; {currentDate} </p>
          </div>
      </footer>
    )
}

export default Footer