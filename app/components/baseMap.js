'use client'

import L from 'leaflet'
import MarkerIcon from '/public/marker-icon.png'
import MarkerShadow from '/public/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, LayersControl } from 'react-leaflet'
import { useState } from 'react'
import { Markers } from './Marker'
//import {BaseLayer} from 'LayersControl ';

const map = () => {

    const [coord, setCoord] = useState([23.470002, 120.957274])


    const SearchLocation = () => {
        return (
            <div className="search-location">
                <input type="text" placeholder="Search Location" />
            </div>
        )
    }

    const GetMyLocation = () => {
        const getMyLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setCoord([position.coords.latitude, position.coords.longitude])
                })
            } else {
                console.log("Geolocation is not supported by this browser.")
            }
        }

        return (
            <div className="get-my-location">
                <button onClick={getMyLocation}>Get My Location</button>
            </div>
        )
    }

    // const Messenger = () =>{

    //     return (
    //         <div className='absolute right-72 bottom-9 w-64 h-24 bg-white rounded-lg'  style={{ zIndex: 999 }}>
    //             <div><p>{`緯度:${e.latlng.lat}<br/>經度:${e.latlng.lng}`}</p></div>
    //         </div>
    //     )

    // }


    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleMapClick = (e) => {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
    }




    const accessToken = 'pk.eyJ1IjoibHVsdWNoZW5nIiwiYSI6ImNsb3Bja3Z6YzA0cDMya28xYjJvOXE4bncifQ.RWepwc59NHV8-OnF5-C7pQ'
    const mapboxUsername = 'lulucheng'
    const mapboxId = 'clopfkjxr003s01pqhazl2dn9';

    return (
        <div>
            <SearchLocation />
            <GetMyLocation />
            <MapContainer style={{ width: '1000px', height: '745px' }} center={coord} zoom={13} scrollWheelZoom={false} onClick={handleMapClick} >
                <LayersControl position='topright'>
                    <LayersControl.BaseLayer checked name="開放街圖">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Mapbox等高線地形圖">
                        <TileLayer
                            attribution=' &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                            url={`https://api.mapbox.com/styles/v1/${mapboxUsername}/${mapboxId}/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`}
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name='魯地圖 Taiwan Topo'>
                        <TileLayer
                            attribution='&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
                            // url='https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png'
                            url='https://tile.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png'
                        />
                    </LayersControl.BaseLayer>
                    <Markers />
                </LayersControl>
            </MapContainer>

        </div>
    )
}

export default map

