import Logo from '../../images/logo.png'
import { LogoutButton } from '../..';
import '../../styles/Header.css'
export default function Header({ isAuthenticated, onLogout }) {
  return (
      <nav>
      <img src={Logo} alt='vélib' className='logo' />
      {isAuthenticated ? (
        <></>
          ) : (
            <>
              <button className='bouton'><a href="/inscription" className="lien">Inscription</a></button>
              <button className='bouton'><a href="/connection" className="lien">Connexion</a></button>
            </>
          )}
        <button className='bouton'><a href="/" className="lien">Découvrir Vélib</a></button>
      <button className='bouton'><a href="/map" className="lien">Cartes des stations</a></button>
      <button className='bouton'><a href="/contact" className="lien">Contacter Vélib</a></button>
      {isAuthenticated && (
        <LogoutButton onLogout={onLogout} />
      )
      }
      </nav>
  );
}
