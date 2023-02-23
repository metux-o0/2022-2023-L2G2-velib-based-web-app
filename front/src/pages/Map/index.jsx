import React from "react";
import GoogleMapReact from 'google-map-react';
export default function SimpleMap(){
  const defaultProps = {
    center: {
      lat: 48.8607882,
      lng: 2.3492268
    },
    zoom: 13
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAvdUOTN-1ChKx-bX7D7C6UsETuWHYI8Xg" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
      </GoogleMapReact>
    </div>
  );
}