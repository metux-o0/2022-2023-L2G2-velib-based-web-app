import React, { useState } from 'react';

export default function Connection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
          <label htmlFor="email">Email : </label>
          <input type="email" name="email" onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password">Mot de passe : </label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Connexion</button>
      </form>
      </div>
    );
  }