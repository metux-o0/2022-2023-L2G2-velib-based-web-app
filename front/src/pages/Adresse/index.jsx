import React, { useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import config from '../Map/config.json';

const Adresse = () => {
const [address, setAddress] = useState('');
const [autocomplete, setAutocomplete] = useState(null);
//eslint-disable-next-line
const [predictions, setPredictions] = useState([]);

const handleInputChange = useCallback((event) => {
  setAddress(event.target.value);
  if (autocomplete) {
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: event.target.value }, setPredictions);
  }
}, [autocomplete]);

const handleApiLoaded = ({ maps }) => {
  setAutocomplete(new maps.places.Autocomplete(document.getElementById('autocomplete'), {}));
};

const handleSubmit = (event) => {
  event.preventDefault();
  fetch('/adresse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  })
  .then((response) => {
    if (response.ok) {
      console.log('Adresse envoyée au backend avec succès');
    } else {
      console.log("Erreur lors de l'envoi de l'adresse au backend");
    }
  })
  .catch((error) => {
    console.log('Erreur:', error);
  });
};
return (
<div>
  <h1>Adresse Favoris</h1>
  <form onSubmit={handleSubmit}>
    <label>
      Adresse:
      <input id="autocomplete" type="text" value={address} onChange={handleInputChange} style={{ height:'50p', width: '400px' }} />
      </label>
      <br />
      <button type="submit">Valider</button>
      </form>
      <div style={{ height: '0', width: '0' }}>
        <GoogleMapReact
        bootstrapURLKeys={{ key: config.googlemapkey, libraries: ['places'] }}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        defaultZoom={12}
        onGoogleApiLoaded={handleApiLoaded}
        yesIWantToUseGoogleMapApiInternals={true}
        />
        </div>
        </div>
        );
      };

export default Adresse;