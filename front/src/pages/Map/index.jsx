import React from "react";
import '../../styles/Carte.css'
import GoogleMapReact from 'google-map-react';
import config from './config.json'
import Search from "./Search";
import Localisation from '../../images/localisation.png'
const Point =({mecanique,electrique,stationCode,name, onClick})=>(
  <button onClick={onClick} title={"Station n°"+stationCode+"\n"+name+"\nVélib mécanique(s) : "+mecanique+"\nVélib éléctrique(s) : "+electrique} className="point">
     <img src={Localisation} alt='vélib' />
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
    .then((stations)=>setVelos(stations.data.stations));
  },[]);
  const defaultProps = {
    center: {
      lat: 48.8607882,
      lng: 2.3492268
    },
    zoom: 13,
  }
  const handleMarkerClick = (station) => {
    // gérer l'événement de clic ici
    console.log(`Cliqué sur la station ${station.name}`);
  }
  return (
    <div style={{ height: '100vh', width: '100%'}}>
      <Search />
      <GoogleMapReact

        bootstrapURLKeys={{key:apikey}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {stations.map((station)=>{
            return(
              <Point 
              key={station.station_id}
              lat={station.lat}
              lng={station.lon}
              stationCode={station.stationCode}
              name={station.name}
              onClick={() => handleMarkerClick(station)}
                />
            )
        })}
        
      </GoogleMapReact>
    </div>
  );
};