import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker,InfoWindow,DirectionsRenderer } from '@react-google-maps/api';
import config from './config.json'
const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 48.856614,
  lng: 2.3522219
};

const options = {
  disableDefaultUI: true,
  zoomControl: true
};

const libraries=["places"];

export default function Carte() {
  //crochets:d'utiliser l'état et d'autres fonctionnalités de React sans écrire de classe
  //useState est un Hook qui vous permet d'ajouter l'état React aux composants de la fonction
  //1er élément:valeur donné 2ème élément: fonction pour mise à jour
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [showMechanical, setShowMechanical] = useState(false);
  const [showElectrique,setShowElectrique]=useState(false);
  //useEffect: fonction après le render quand map change
  useEffect(() => {
    //vérifie si l'objet "window" est défini
    if (typeof window !== 'undefined') {
      //vérifie si l'objet "google" et "google.maps" est défini
      if (window.google && window.google.maps) {
        //DOM avec id 'autocomplete-input'
        const input = document.getElementById('autocomplete-input')
        const searchBox = new window.google.maps.places.SearchBox(input);
        setSearchBox(searchBox);
        //écouteur d'événement ajouté à l'objet SearchBox
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places.length === 0) return;
          //LatLngBounds: définir les limites des zones géographiques affichées, basé sur les coordonnées sélectionné
          const bounds = new window.google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) return;
            bounds.extend(place.geometry.location);
            setMarkerPosition(place.geometry.location);
          });
          //ajuster
          map.fitBounds(bounds);
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        });
      }
    }
  }, [map]);
//creer
  const onLoad = (map) => {
    setMap(map);
  };
//supprimer
  const onUnmount = () => {
    setMap(null);
  };
  const [stations,setStations]=useState([]);
  useEffect(()=>{
    fetch("/stations")
    //then :méthode quand promesse est résolue avec succès
    .then((res)=>res.json())
    .then((stations)=>setStations(stations.data.stations));
  },[]);
  const [velos,setVelos]=useState([]);
  useEffect(()=>{
    fetch("/velodispo")
    .then((res)=>res.json())
    .then((velos)=>setVelos(velos.data.stations));
  },[]);
  const fetchDistanceInfo = (origin, destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      //à pied
      travelMode: 'WALKING',
    }, (response, status) => {
      if (status === 'OK') {
        const element = response.rows[0].elements[0];
        setDistanceInfo({
          distance: element.distance.text,
          duration: element.duration.text,
        });
      }
    });
  };
  const handleFilterClick = () => {
    setShowMechanical(!showMechanical);
    setShowElectrique(!showElectrique);
  };
  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    const directionsService = new window.google.maps.DirectionsService();
//méthode route() de l'objet DirectionsService 
    directionsService.route(
  {
    origin: markerPosition,
    destination: { lat: station.lat, lng: station.lon },
    travelMode: window.google.maps.TravelMode.WALKING
  },
  (result, status) => {
    if (status === window.google.maps.DirectionsStatus.OK) {
      setDirections(result);
    } else {
      console.error(`error fetching directions ${result}`);
    }
  }
);
if (searchBox && searchBox.getPlaces().length > 0) {
  const origin = searchBox.getPlaces()[0].formatted_address;
  const destination = `${station.lat},${station.lon}`;
  fetchDistanceInfo(origin, destination);
}

  };
  return (
    <LoadScript googleMapsApiKey={config.googlemapkey} libraries={libraries}>
      <button onClick={handleFilterClick}>
  {showMechanical ? 'Afficher toutes les stations' : 'Afficher les stations avec vélos mécaniques'}
</button>
<button onClick={handleFilterClick}>
  {showElectrique ? 'Afficher toutes les stations' : 'Afficher les stations avec vélos éléctrique'}
</button>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={options}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {stations.map((station) => {
          const velo = velos.find(({ station_id }) => station_id === station.station_id);
          if ((!showMechanical || (velo.num_bikes_available_types[0].mechanical > 0))||(!showElectrique||(velo.num_bikes_available_types[1].ebike>0))) {
          return (
          <Marker
          key={station.station_id}
          position={{ lat: station.lat, lng: station.lon }}
          onClick={() => handleMarkerClick(station)}
          label={`${velo.num_bikes_available}`}
          >
            {selectedStation && selectedStation.station_id === station.station_id && (
            <InfoWindow onCloseClick={() => setSelectedStation(null)}>
              <div>
                <h2>{station.name}</h2>
                <p>Station n°{station.stationCode}</p>
                <p>Vélib mécanique(s) : {velo.num_bikes_available_types[0].mechanical}</p>
                <p>Vélib éléctrique(s) : {velo.num_bikes_available_types[1].ebike}</p>
                <p>Place(s) : {velo.numDocksAvailable}</p>
                <p>Pass temporaires : {station.rental_methods ? "achat possible en station (CB)" : "pas d'achat possible en station"}</p>
                {distanceInfo && (
        <p>Distance: {distanceInfo.distance}, Durée: {distanceInfo.duration}</p>
      )}
                </div>
                </InfoWindow>
                )}
                </Marker>
                );
                }})}
        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              //remplisage
              fillColor: "white",
              //不透明度
              fillOpacity: 1,
              //trait
              strokeColor: "black",
              strokeOpacity: 1,
              strokeWeight: 1,
              scale: 10
            }}
          />
        )}

        <Autocomplete
          onLoad={(autocomplete) => setSearchBox(autocomplete)}
          onPlaceChanged={() => {
            const place = searchBox.getPlace();
            if (place.geometry) {
              map.panTo(place.geometry.location);
              if (map.getZoom() > 15) {//dézommer
                map.setZoom(15);
              }
              setMarkerPosition(place.geometry.location);
            }
          }}
        >
          <input
            id="autocomplete-input"
            type="text"
            placeholder="Enter an address"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `500px`,
              height: `50px`,
              padding: `0 12px`,
              //rayon de bordure
              borderRadius: `3px`,
              //框影
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              //大纲
              outline: `none`,
              //文字溢出
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              top: "10px"
            }}
          />
        </Autocomplete>
        {directions && (
  <DirectionsRenderer
    directions={directions}
    options={{
      polylineOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 5
      },
      markerOptions: {
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          strokeColor: "#FF0000",
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeWeight: 2,
          //规模
          scale: 4
        }
      }
    }}
  />
)}

      </GoogleMap>
    </LoadScript>
  );
}