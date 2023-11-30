

import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet';
import 'leaflet-easyprint/dist/bundle';
// 動態導入 leaflet-easyPrint
import dynamic from 'next/dynamic';

const EasyPrint = dynamic(() => import('leaflet-easyprint'), { ssr: false });

// 地圖截圖(地圖上)
export const PrintComponent = () => {
    const map = useMap();

    useEffect(() => {
        //檢查 map.easyPrintControl，是否已經存在避免重複添加
        if (EasyPrint && !map.easyPrintControl) {
            // 初始化 leaflet-easyPrint
            const easyPrintControl = L.easyPrint({
                title: '地圖截圖',
                position: 'topleft',
                sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
                filename: 'myMap',
                exportOnly: true,
                hideControlContainer: false
            }).addTo(map);

            // leaflet-easyPrint 控件實例存地圖，避免重複添加
            map.easyPrintControl = easyPrintControl;
        }
    }, []);

    
};



// export const handlePrint = (map ) => {
//     const printer = L.easyPrint({
//         sizeModes: ['Current'],
//         hidden: true,
//         exportOnly: true
//     }).addTo(map);
//     printer.printMap('CurrentSize', 'MyMap');
// }