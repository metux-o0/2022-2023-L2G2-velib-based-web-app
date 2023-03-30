import React, { useState } from 'react';

export default function Connection() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    function handleUsernameChange(event) {
      setUsername(event.target.value);
    }
  
    function handlePasswordChange(event) {
      setPassword(event.target.value);
    }
    function handleSubmit(event) {
      event.preventDefault();
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then(response => {
          if (response.ok) {
            console.log('User authenticated successfully');
            // Redirect to the home page or a protected page
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
            <h1>Connection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Connexion</button>
      </form>
      </div>
    );
  }