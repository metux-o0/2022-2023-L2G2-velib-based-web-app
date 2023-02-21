import logo from '../images/logo.png'
import '../styles/Banner.css'

function Banner(){
    return (
        <div>
            <img src={logo} alt='LOGO' className='logo'/>
            <button class="btn-decouvrir">Découvrir Vélib</button>
			<button class="btn-carte">Cartes des stations</button>
			<button class="btn-contact">Contacter Vélib</button>
        </div>
    )
}

export default Banner