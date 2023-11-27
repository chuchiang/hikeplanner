'use client'


import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Popup, LayersControl, Polyline } from 'react-leaflet'
import { useState } from 'react'
import { Markers } from './Marker'
import SearchControl from './mapSearch'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useSelector, useDispatch } from 'react-redux';
import { geoSearchAdd, clearSearchLocations } from '../slice/mapSlice';


const leafletMap = () => {

    const [coord, setCoord] = useState([23.248325497821178, 120.98989311938537])
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

    //最短路徑資料整理，遍裡每個day對像的locations模組，並取得direction.path
    // const combinedPath = addPath.flatMap(day =>
    //     day.locations.flatMap(attraction =>
    //         attraction.direction && attraction.direction.path ? attraction.direction.path : [] // 如果存在返回 path，否則返回空
    //     ),
    // );
    // console.log(combinedPath)

    // 最短路徑資料整理
    const combinedPath = addPath.flatMap(day =>
        day.locations.flatMap((attraction, index) => {
            if (attraction.direction && index < day.locations.length - 1) {
                return [attraction.direction.path];
            }
            return [];
        }),
    );

    // // 计算 combinedPath，这将在 addPath 更改时自动重新执行
    // const combinedPath = useMemo(() => {
    //     return addPath.flatMap(day =>
    //         day.locations.flatMap((attraction, index) => {
    //             if (attraction.direction && index < day.locations.length - 1) {
    //                 // 生成路径段
    //                 return [attraction.direction.path];
    //             }
    //             return [];
    //         }),
    //     );
    // }, [addPath]); // 依赖项为 addPath，当 addPath 改变时重新计算






    //搜尋事件資料
    const handleSearchResult = (result) => {
        const newLocation = {
            lat: result[0],
            lng: result[1]
        };
        console.log(newLocation)
        dispatch(clearSearchLocations());// 清除 geoSearch 的 經緯度
        dispatch(geoSearchAdd(newLocation)); // 更新 geoSearch 的 經緯度
    };




    return (
        <div>
            {/* <SearchLocation />
            <GetMyLocation /> */}

            <MapContainer style={{ width: '800px', height: '720px' }} center={coord} zoom={13} scrollWheelZoom={false} >
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
                <LayersControl position='topright'>
                    <LayersControl.BaseLayer checked name="開放街圖">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name='魯地圖 Taiwan Topo'>
                        <TileLayer
                            attribution='&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
                            // url='https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png'
                            url='https://tile.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png'
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
                {/* {combinedPath.length > 0 && (<Polyline
                    pathOptions={{ color: 'red' }}
                    positions={combinedPath.map(coord => [coord[1], coord[0]])}

                />
                )} */}
                {combinedPath.map((segment, index) => (
                    <Polyline
                        key={index}
                        pathOptions={{ color: 'red' }}
                        positions={segment.map(coord => [coord[1], coord[0]])}
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default leafletMap



