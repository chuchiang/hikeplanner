import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react';



export const Markers = () => {

    const [selectedPosition, setSelectedPosition] = useState(null);




    const map = useMap(); // 使用 useMap hook




    
    const mapEvents = useMapEvents({
        click(e) {
            setSelectedPosition([
                e.latlng.lat,
                e.latlng.lng
            ]);
            // const popup = L.popup({
            //     autoPanPadding: [12, 12],
            //     // position:"bottomright"
            // })
            //     .setLatLng(e.latlng)
            //     .setContent(`緯度:${e.latlng.lat}<br/>經度:${e.latlng.lng}`)
            //     .openOn(map); 

        }

    })




    return (
        <>
            {selectedPosition && (
                <Marker position={selectedPosition} interactive={false}>
                    <div className='absolute right-2 bottom-9 w-64 h-24 bg-white rounded-lg' style={{ zIndex: 999 }}>
                        <div>{`緯度:${selectedPosition[0]}`}<br />{`經度:${selectedPosition[1]}`}</div>
                    </div>
                </Marker>
            )}
        </>)

}