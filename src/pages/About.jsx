import { GiFlowerPot } from 'react-icons/gi';

function About() {
    return (
        <div>
            <GiFlowerPot className='inline pb-8 text-7xl'/>
            <div className='inline text-5xl font-semibold'>Mi Gusta</div>
            <p>This app was created by Massimiliano Celant.</p>
            <p>Created using React </p>
            <p><strong>linkedin.com/in/maxcelant</strong></p>
        </div>
      )
}

export default About