// // components/LeafletMap.js
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// const ClientMap = () => {
//   return (
//     //center地圖的初始中心位置，zoom地圖初始縮放級別為13
//     <MapContainer center={[23.604799, 120.7976256]} zoom={13} style={{ height: '745px', width: '1000px' }}>
//       {/* //url指定瓦片圖層的來源，這裡使用了OpenStreetMap的瓦片圖層。attribution屬性用來顯示在地圖底部的版權信息。 */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {/* Marker代表地圖上的一個標記點，position指定標記點的位置緯度/經度 */}
//       <Marker position={[23.604799, 120.7976256]}>
//         <Popup>
//           A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };





//components/mapa.js
'use-client';

import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import React from 'react';


const ClientMap = () => {
  const [geoData, setGeoData] = useState({ lat: 23.604799, lng: 16.779852 });

  return (
    <MapContainer center={[geoData.lat, geoData.lng]} zoom={12}>
      <TileLayer
         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       />
      {geoData.lat && geoData.lng && (
        <Marker position={[geoData.lat, geoData.lng]} />
      )}
    </MapContainer>
  );
};

export default ClientMap;
