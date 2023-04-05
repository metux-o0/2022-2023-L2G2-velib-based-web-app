import React, { useState } from 'react';

export default function Adresse(){
    const [adresse, setAdresse] = useState('');
    const [consoleMessages, setConsoleMessages] = useState([]);
    function handleAdresseChange(event) {
        setAdresse(event.target.value);
      }
      function handleSubmit(event) {
        event.preventDefault();
        fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adresse }),
        })
          .then(response => {
            if (response.ok) {
              setConsoleMessages(['adresse envoyé']);
            } else {
              setConsoleMessages(["Erreur: adresse déjà envoyé"]);
              // Display an error message
            }
          })
          .catch(error => {
            setConsoleMessages(['Erreur:', error]);
            // Display an error message
          });
      }
    return(
        <div>
            <h1>Adresse Favoris</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Adresse :
                    <input type="adresse" name="adresse" onChange={handleAdresseChange}/>
                </label>
                <br></br>
                <button type="submit">Valider</button>
            </form>
            <p>{consoleMessages}</p>
        </div>
    )
}