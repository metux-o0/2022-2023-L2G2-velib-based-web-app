import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function Connection({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consoleMessages, setConsoleMessages] = useState([]);
  const history = useHistory();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (response.ok) {
          setConsoleMessages(['Utilisateur authentifié avec succès']);
          onLogin(); // Set the user as authenticated
          history.push('/adresse'); // Redirect to the adresse page
        } else {
          setConsoleMessages(["Erreur: le compte n'existe pas"]);
          // Display an error message
        }
      })
      .catch(error => {
        setConsoleMessages(['Error:', error]);
        // Display an error message
      });
  }

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email : </label>
          <input type="email" name="email" onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password">Mot de passe : </label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Connexion</button>
      </form>
      <p style={{ color: 'red' }}>{consoleMessages}</p>
      <p>
        Pas encore de compte? <Link to="/inscription">Inscrivez-vous ici</Link>
      </p>
      <p>Veuillez vous connecter pour ajouter vos adresses favoris</p>
    </div>
  );
}
