'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Popup, LayersControl, Polyline } from 'react-leaflet'
import { useState, useEffect, use } from 'react'
import { Markers } from './Marker'
import SearchControl from './mapSearch'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useSelector, useDispatch } from 'react-redux';
import { geoSearchAdd, clearSearchLocations } from '../../slice/mapSlice';
import { useMap } from 'react-leaflet';
import { addimg, addimgState } from '../../slice/planningSlice';
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import L from 'leaflet';
import '../../globals.css'
import { addCoordinates, clearCoordinates } from '../../slice/coordinatesSlice'


const CirclieHover = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const addCoordinatesChart = useSelector((state) => {
        console.log(state.coordinates)
        return state.coordinates
    })
    useEffect(() => {
        let circleMarker;

        // addCoordinatesChart 包含座標
        if (addCoordinatesChart && addCoordinatesChart.coordinates) {
            const { lat, lng } = addCoordinatesChart.coordinates;
            circleMarker = L.circleMarker([lat, lng], {
                color: 'white',
                fillColor: 'black',
                fillOpacity: 1,
                radius: 7
            }).addTo(map);
        }

        // 卸載或座標更新移除圓點
        return () => {
            if (circleMarker) {
                circleMarker.remove();
            }
        };
    }, [addCoordinatesChart, map]);
}

// 地圖列印
const MapScreenshoter = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const imgState = useSelector((state) => state.planning.imgState);
    const [screenshoter, setScreenshoter] = useState(null);

    useEffect(() => {
        if (!map || map.hasScreenshoter) return;

        const newScreenshoter = new SimpleMapScreenshoter({
            hideElementsWithSelectors: [".leaflet-control-container", ".leaflet-dont-include-pane", "#snapshot-button"],
            hidden: false,
            mimeType: 'image/jpeg',
            position: 'bottomleft',
        }).addTo(map);

        map.hasScreenshoter = true;
        setScreenshoter(newScreenshoter);

        // 清理
        return () => {
            if (newScreenshoter) {
                newScreenshoter.remove();
            }
            map.hasScreenshoter = false;
        };
    }, [map]);

    useEffect(() => {
        if (!screenshoter || imgState !== 'True') return;

        // 觸發截圖轉base64
        const captureScreenshot = async () => {
            try {
                const dataURL = await screenshoter.takeScreen('image');
                dispatch(addimg(dataURL));
            } catch (error) {
                console.error("截圖錯誤", error);
            }
        };

        map.once('load', captureScreenshot);
        if (map._loaded) {
            captureScreenshot();
        }
    }, [screenshoter, imgState, dispatch]);
    return null;
};

const leafletMap = () => {

    const dispatch = useDispatch();
    const prov = new OpenStreetMapProvider();
    const accessToken = 'pk.eyJ1IjoibHVsdWNoZW5nIiwiYSI6ImNsb3Bja3Z6YzA0cDMya28xYjJvOXE4bncifQ.RWepwc59NHV8-OnF5-C7pQ'
    const mapboxUsername = 'lulucheng'
    const mapboxId = 'clopfkjxr003s01pqhazl2dn9';

    //最短路徑資料取得
    const addPath = useSelector((state) => {
        console.log(state.planning.days)
        return state.planning.days
    })

    // 地圖畫面為已知景點第一格或初始值
    const position = useSelector((state) => {
        console.log(state.planning.days)
        return state.planning.days[0].locations[0]
    })
    const [coord, setCoord] = useState(position ? [position.lat, position.lng] : [23.248325497821178, 120.98989311938537]);


    // 最短路徑資料整理
    const combinedPath = addPath.flatMap(day =>
        day.locations.flatMap((attraction, index) => {
            if (attraction.direction && index < day.locations.length - 1) {
                return [attraction.direction.path];
            }
            return [];
        }),
    );

    //搜尋事件資料
    const handleSearchResult = (result) => {
        const newLocation = {
            lat: result[0],
            lng: result[1]
        };
        console.log(newLocation)
        dispatch(clearSearchLocations()); //清除 geoSearch 的 經緯度
        dispatch(geoSearchAdd(newLocation)); // 更新 geoSearch 的 經緯度
    };

    return (
        <div className='bg-white w-full h-full'>
            <MapContainer id='map' style={{ width: '100%', height: '100%' }} center={coord} zoom={13} scrollWheelZoom={false} >

                <SearchControl
                    provider={prov}
                    showMarker={false}
                    showPopup={false}
                    popupFormat={({ query, result }) => result.label}
                    maxMarkers={3}
                    retainZoomLevel={true}
                    animateZoom={true}
                    autoClose={false}
                    searchLabel={"Enter address, please"}
                    keepResult={true}
                    onResult={(result) => {
                        console.log(result);
                        const coordinates = [result.location.y, result.location.x]; //搜尋結果
                        handleSearchResult(coordinates);
                    }}
                />
                <LayersControl position='bottomleft' className='z-40'>
                    <LayersControl.BaseLayer name="開放街圖">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='魯地圖 Taiwan Topo'>
                        <TileLayer
                            attribution='&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
                            url='https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png'
                        // url='https://tile.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Mapbox等高線地形圖">
                        <TileLayer
                            attribution=' &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                            url={`https://api.mapbox.com/styles/v1/${mapboxUsername}/${mapboxId}/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`}
                        />
                    </LayersControl.BaseLayer>
                    <Markers />
                </LayersControl>
                {/* 最短路徑 */}
                {combinedPath.map((segment, index) => (
                    <Polyline
                        key={index}
                        pathOptions={{ color: 'red' }}
                        positions={segment.map(coord => [coord[1], coord[0]])}
                    />
                ))}
                <MapScreenshoter className='z-40' />
                <CirclieHover />
            </MapContainer>
        </div >
    )
}

export default leafletMap

