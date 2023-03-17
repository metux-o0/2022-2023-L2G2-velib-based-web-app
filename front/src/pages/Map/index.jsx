import React from "react";
import GoogleMapReact from 'google-map-react';
import config from './config.json'
import Search from "./Search";

const Point =({image})=><div>{image}</div>;
const apikey=config.googlemapkey;
//const datas=require('../../stations.json')
export default function Carte(){
  //parser les donnée 解析
  const [stations,setData]=React.useState([]);
  React.useEffect(()=>{
    fetch("/stations")
    .then((res)=>res.json())
    .then((stations)=>setData(stations.data.stations));
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
            image="📍"
              />
          );
        })}
      </GoogleMapReact>
    </div>
  );
};