import React from "react";
import GoogleMapReact from 'google-map-react';
import { stations } from "../../datas/stations";
import config from './config.json'
const apikey=config.googlemapkey;
const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default function Carte(){
  const defaultProps = {
    center: {
      lat: 48.8607882,
      lng: 2.3492268
    },
    zoom: 13,
  };

  return (
    <div style={{ height: '100vh', width: '100%'}}>
      <GoogleMapReact

        bootstrapURLKeys={{key:apikey}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={stations.lat}
          lng={stations.lng}
          text="📍"
        />
      </GoogleMapReact>
    </div>
  );

};
