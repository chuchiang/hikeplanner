'use client'


import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Popup, LayersControl, Polyline } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { Markers } from './Marker'
import SearchControl from './mapSearch'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useSelector, useDispatch } from 'react-redux';
import { geoSearchAdd, clearSearchLocations } from '../slice/mapSlice';
import { PrintComponent } from '../components/printMap'
import { useMap } from 'react-leaflet';
import { addimg, addimgState } from '../slice/planningSlice';
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import L from 'leaflet';
import '../globals.css'
import { addCoordinates, clearCoordinates } from '../slice/coordinatesSlice'


const CirclieHover = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const addCoordinatesChart = useSelector((state) => {
        console.log(state.coordinates)
        return state.coordinates
    })
    useEffect(() => {
        let circleMarker;

        // 确保 addCoordinatesChart 包含坐标信息
        if (addCoordinatesChart && addCoordinatesChart.coordinates) {
            const { lat, lng } = addCoordinatesChart.coordinates;
            circleMarker = L.circleMarker([lat, lng], {
                color: 'white',
                fillColor: 'black',
                fillOpacity: 1,
                radius: 7
            }).addTo(map);
        }

        // 组件卸载或坐标更新时移除圆点
        return () => {
            if (circleMarker) {
                circleMarker.remove();
            }
        };
    }, [addCoordinatesChart, map]);
}

const MapScreenshoter = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const imgState = useSelector((state) => state.planning.imgState);


    useEffect(() => {
        if (!map) return;

        // 使用whenCreated回调获取地图实例
        const screenshoter = new SimpleMapScreenshoter({
            hideElementsWithSelectors: [".leaflet-control-container", ".leaflet-dont-include-pane", "#snapshot-button"],
            hidden: true,
            mimeType: 'image/jpeg',
        }).addTo(map);

        const captureScreenshot = async () => {
            try {
                const dataURL = await screenshoter.takeScreen('image');
                dispatch(addimg(dataURL)); // 将 base64 图像数据发送到 Redux
            } catch (error) {
                console.error("截图过程中发生错误", error);
            }
        };

        if (imgState === 'True') {
            // 监听一次地图的'load'事件
            map.once('load', captureScreenshot);
            // 如果地图已经加载（例如，用户在地图上进行了交互），直接截图
            if (map._loaded) {
                captureScreenshot();
            }
        }



    }, [map, imgState, dispatch]);

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
            <MapContainer id='map' style={{ width: '100%', height: '100%'}} center={coord} zoom={13} scrollWheelZoom={false} >

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
                    <LayersControl.BaseLayer name="開放街圖">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='魯地圖 Taiwan Topo'>
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
                {combinedPath.map((segment, index) => (
                    <Polyline
                        key={index}
                        pathOptions={{ color: 'red' }}
                        positions={segment.map(coord => [coord[1], coord[0]])}
                    />
                ))}
                <MapScreenshoter className='z-40' />
                <PrintComponent className='z-40' />
                <CirclieHover />
            </MapContainer>
        </div >
    )
}

export default leafletMap

