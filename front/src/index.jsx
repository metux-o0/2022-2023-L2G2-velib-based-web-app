import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Carte from './pages/Map';
import Header from './components/Header';
import Error from './components/Error';
import Inscription from './pages/Inscription';
import Connection from './pages/Connexion';
import Adresse from './pages/Adresse';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
    localStorage.setItem('token', 'my_token');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  }

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/map">
          <br />
          <Carte />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/inscription">
          <Inscription />
        </Route>
        <Route exact path="/connection">
          <Connection onLogin={handleLogin} />
        </Route>
        <Route exact path="/adresse">
          {isAuthenticated ? <Adresse /> : <Redirect to="/connection" />}
        </Route>
        <Route>
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export function LogoutButton({ onLogout }) {
  return (
    <button onClick={onLogout} style={{backgroundColor:"blanchedalmond",borderBlockColor:"antiquewhite",padding:"20px 80px",color:"orange"}}>Déconnexion</button>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
)