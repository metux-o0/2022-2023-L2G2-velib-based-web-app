import Logo from '../../images/logo.png'
import '../../styles/Header.css'

function Header() {
  return (
    <nav>
      <img src={Logo} alt='vélib' className='logo' />
      <button className='bouton'><a href="/" className="lien">Découvrir Vélib</a></button>
      <button className='bouton'><a href="/map" className="lien">Cartes des stations</a></button>
      <button className='bouton'><a href="/contact" className="lien">Contacter Vélib</a></button>
      <button className='bouton'><a href="/inscription" className="lien">Inscription</a></button>
      <button className='bouton'><a href="/connection" className="lien">Connection</a></button>
    </nav>
  )
}

export default Header