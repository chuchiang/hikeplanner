
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addLocation } from '../slice/planningSlice';
import { geoSearchAdd, clearSearchLocations } from '../slice/mapSlice';
import fetchLocation from '../api/fetchLocation';


export const Markers = () => {

    const getsearchLocation = useSelector((state) => state.geoSearch.searchLocation);//取得地圖經緯度(click 或 搜尋)
    const [legend, setLegend] = useState(null);//地圖控制區
    const [attraction, setAttraction] = useState('');
    const dispatch = useDispatch();
    const map = useMap();

    const planningMarker = useSelector((state) => {
        return state.planning.days
    })

    //經緯度去搜尋地點名稱
    useEffect(() => {
        const fetchData = async () => {
            if (getsearchLocation && getsearchLocation.length > 0) {
                const lastSearchLocation = getsearchLocation[getsearchLocation.length - 1];
                const locationData = await fetchLocation(lastSearchLocation);
                if (locationData) {
                    setAttraction(locationData);
                }
            }
        };
        fetchData();
    }, [getsearchLocation]);


    // 建立圖例控制項
    useEffect(() => {

        const legendControl = L.control({ position: 'bottomright' });

        // 設定圖例內容
        legendControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            // 自訂圖例內容
            if (getsearchLocation.length > 0) {
                div.innerHTML = `
                <div class=' w-72 h-28 bg-white p-2 rounded-lg flex flex-col justify-center shadow-md font-sans'>
                    <div class='text-sm font-bold'>${attraction.name || '搜尋景點名稱...'} / ${attraction.region || '搜尋地點名稱...'}</div>
                    <div class='text-sm'>${getsearchLocation ? `經度:${getsearchLocation[0].lng}<br />緯度:${getsearchLocation[0].lat}` : ''}</div>
                    <div>${attraction.name ? "<button class='hover:bg-gray-300 border-gray-400 hover:shadow-xl border-2 p-1 mt-1 hover:' type='submit' onClick='handleAddMarker(event)'><p class='font-bold text-black flex items-center'><img src='/marker-icon.png' class='w-3 mr-1'/>新增</p></button>" : ''}</div >
                </div >`

            }
            return div;
        };

        setLegend(legendControl);

        // 將圖例控件添加到地圖
        if (map && legendControl) {
            legendControl.addTo(map);
        }

        // 組件卸載時刪除圖例
        return () => {
            if (legendControl && map) {
                legendControl.remove();
            }
        };
    }, [getsearchLocation, attraction]);



    //點擊地圖取得地點
    const mapEvents = useMapEvents({
        click(e) {
            dispatch(clearSearchLocations()); // 清除 geoSearch 的 經緯度
            const mapLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            console.log(mapLocation)
            dispatch(geoSearchAdd(mapLocation)); // 更新 geoSearch 的 經緯度
            setAttraction('加載景點中...')
        },
    });


    //景點click新增事件
    window.handleAddMarker = (e) => {
        L.DomEvent.stopPropagation(e); // 阻止 Leaflet 事件傳播

        if (getsearchLocation && getsearchLocation.length > 0) {
            const newMark = {
                id: planningMarker.length + 1,
                lat: getsearchLocation[0].lat,
                lng: getsearchLocation[0].lng,
                name: attraction.name,
                region: attraction.region
            };
            dispatch(addLocation(newMark)); // redux 資料給 planning
            dispatch(clearSearchLocations());// 清除 geoSearch 的 經緯度
        }
    };


    return (
        <>
            {planningMarker.map(day =>
                day.locations.map((location, index) => (
                    <Marker key={`${day.date}-${index}`} position={[location.lat, location.lng]}>
                        <Popup>
                            地點：{location.name}<br />經度：{location.lng.toFixed(4)}<br />緯度：{location.lat.toFixed(4)}
                        </Popup>

                    </Marker>
                ))

            )}

            {getsearchLocation && getsearchLocation.length > 0 && (
                <Marker position={[getsearchLocation[0].lat, getsearchLocation[0].lng]} interactive={false}>
                    <div
                        className=' bg-white rounded-lg'
                        ref={(ref) => ref && legend && legend.addTo(map)} // ref或取组件或 DOM 節點的直接引用，向div 新增圖例控件
                    />
                </Marker>
            )}
        </>
    );
};