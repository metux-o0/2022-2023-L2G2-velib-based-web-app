import React from "react";
import GoogleMapReact from 'google-map-react';
import config from './config.json'
import Search from "./Search";
//import { useState,useEffect } from "react";//parser les donnée 解析
const apikey=config.googlemapkey;
const datas=require('../../stations.json')
const Point=({text})=><div>{text}</div>;
export default function Carte(){
  //const [datas,setDatas]=useState([]);
  /*useEffect(()=>{
    fetch('')
    .then((response)=>response.json())
    .then((json)=>setDatas(json));
  },[]);*/ //pour le server
  const stations=datas.data.stations;
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
            text="📍"
              />
          );
        })}
      </GoogleMapReact>
    </div>
  );

};
