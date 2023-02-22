import Logo from '../../images/logo.png'
import '../../styles/Header.css'

function Header() {
  return (
    <nav>
      <img src={Logo} alt='vélib' className='logo' />
      <button className='bouton'><a href="/" class="lien">Découvrir Vélib</a></button>
      <button className='bouton'><a href="/map" class="lien">Cartes des stations</a></button>
      <button className='bouton'><a href="/contact" class="lien">Contacter Vélib</a></button>
    </nav>
  )
}

export default Header