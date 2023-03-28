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
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [showMechanical, setShowMechanical] = useState(false);
  const [showElectrique,setShowElectrique]=useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.google && window.google.maps) {
        const input = document.getElementById('autocomplete-input');
        const searchBox = new window.google.maps.places.SearchBox(input);
        setSearchBox(searchBox);

        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places.length === 0) return;

          const bounds = new window.google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) return;
            bounds.extend(place.geometry.location);
            setMarkerPosition(place.geometry.location);
          });

          map.fitBounds(bounds);
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        });
      }
    }
  }, [map]);

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };
  const [stations,setStations]=useState([]);
  useEffect(()=>{
    fetch("/stations")
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
directionsService.route(
  {
    origin: markerPosition,
    destination: { lat: station.lat, lng: station.lon },
    travelMode: window.google.maps.TravelMode.BICYCLING
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
              fillColor: "white",
              fillOpacity: 1,
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
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none
`,
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