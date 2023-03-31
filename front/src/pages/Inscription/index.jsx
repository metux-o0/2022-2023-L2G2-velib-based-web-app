import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Inscription() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then(response => {
        if (response.ok) {
          console.log('User created successfully');
          // Redirect to the home page or login page
        } else {
          console.log('Error:', response.status);
          // Display an error message
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Display an error message
      });
  }
  
  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur : 
          <input type="text" name="name" onChange={handleUsernameChange} />
          </label>
        <br></br>
        <label>
          Email : 
          <input type="email" name="email" onChange={handleEmailChange} />
        </label>
        <br></br>
        <label>
          Mot de passe : 
          <input type="password" name="password" onChange={handlePasswordChange} />
        </label>
        <br></br>
        <button type="submit">Valider</button>
      </form>
      <p>
      Vous avez déjà un compte?<Link to="/connection">Login</Link>
      </p>
    </div>
  );
}
