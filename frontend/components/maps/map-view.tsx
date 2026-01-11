"use client";

import React, { useState, useEffect, JSX } from 'react';

interface Location {
    latitude: number;
    longitude: number;
}

const mapStyles = `
  .leaflet-container {
    height: 100%;
    width: full;
    z-index: 1;
  }
`;

const MapView: React.FC<Location> = (props) => {
  const [ClientMap, setClientMap] = useState<React.ReactElement | null>(null);

  const LoadMap = async () => {
    const L = await import('leaflet');
    const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

    await import('leaflet/dist/leaflet.css');

    const DefaultIcon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const STADIA_API_KEY = "NONE";
    const tileUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`;

    setClientMap(
        <MapContainer 
        center={[props.latitude, props.longitude]}
        zoom={16} 
        scrollWheelZoom={true}
        >
        <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />
        <Marker position={[props.latitude, props.longitude]} icon={DefaultIcon}>
            <Popup>
              <b>Fixed Location</b><br />
              {props.latitude}, {props.longitude}
            </Popup>
          </Marker>
        </MapContainer>        
    );
  };

  useEffect(() =>{
    LoadMap();
  }, [])

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
        Map Location
      </h3>
      <div style={{ maxWidth: 'full', margin: '20px auto', fontFamily: 'sans-serif' }}>
        <style>{mapStyles}</style>
        <div style={{ height: '450px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
          {ClientMap ? ClientMap : (
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              Loading Map...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapView;