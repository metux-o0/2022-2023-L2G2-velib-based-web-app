import React from "react";
import '../../styles/Carte.css'
import GoogleMapReact from 'google-map-react';
import config from './config.json';
import Localisation from '../../images/localisation.png';
const Point = ({ place,cb,mecanique, electrique, stationCode, name, onClick }) => (
  <button
    onClick={onClick}
    title={`Station n° ${stationCode}\n${name}\nVélib mécanique(s) : ${mecanique}\nVélib éléctrique(s) : ${electrique}\nPlace(s) : ${place}\nPass temporaires : ${cb}`}
    className="point"
  >
    <img src={Localisation} alt="vélib" />
  </button>
);
const apikey=config.googlemapkey;
//const datas=require('../../stations.json')
export default function Carte(){
  //parser les donnée 解析
  const [stations,setStations]=React.useState([]);
  React.useEffect(()=>{
    fetch("/stations")
    .then((res)=>res.json())
    .then((stations)=>setStations(stations.data.stations));
  },[]);
  const [velos,setVelos]=React.useState([]);
  React.useEffect(()=>{
    fetch("/velodispo")
    .then((res)=>res.json())
    .then((velos)=>setVelos(velos.data.stations));
  },[]);
  const defaultProps = {
    center: {
      lat: 48.8607882,
      lng: 2.3492268
    },
    zoom: 13,
  }
  return (
    <div style={{ height: '100vh', width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{key:apikey}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {stations.map((station) => {
          const velo=velos.find(({station_id})=>station_id===station.station_id);
          return (
          <Point 
          key={station.station_id}
          lat={station.lat}
          lng={station.lon}
          stationCode={station.stationCode}
          name={station.name}
          mecanique={velo.num_bikes_available_types[0].mechanical}
          electrique={velo.num_bikes_available_types[1].ebike}
          place={velo.numDocksAvailable}
          cb={station.rental_methods ? "achat possible en station (CB)":"pas d'achat possible en station"}
          />
          )
          })}
      </GoogleMapReact>
    </div>
  );
};