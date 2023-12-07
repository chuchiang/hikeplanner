

import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet';
import 'leaflet-easyprint/dist/bundle';
// 動態導入 leaflet-easyPrint
import dynamic from 'next/dynamic';

import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";








//地圖截圖(地圖上)
// export const PrintComponent = () => {
//     const map = useMap();

//     useEffect(() => {
//         const screenshoter = new SimpleMapScreenshoter({
//             hideElementsWithSelectors: [".leaflet-control-container", ".leaflet-dont-include-pane", "#snapshot-button"],
//             hidden: false,
//             mimeType: 'image/jpeg',
//         }).addTo(map);

//         const captureScreenshot = async () => {
//             try {
//                 const dataURL = await screenshoter.takeScreen('image');

//                 // 创建一个用于下载的临时链接
//                 const downloadLink = document.createElement('a');
//                 downloadLink.href = dataURL;
//                 downloadLink.download = 'map-screenshot.jpg'; // 设置下载的文件名
//                 document.body.appendChild(downloadLink);
//                 downloadLink.click();
//                 document.body.removeChild(downloadLink); // 移除临时创建的链接
//             } catch (error) {
//                 console.error("截图过程中发生错误", error);
//             }
//         };

//         // 您可以根据需要触发 captureScreenshot 函数
//         // 例如，可以绑定到某个按钮的点击事件
//     }, [map]);

//     return null; // 由于不需要渲染任何内容，返回 null
// };





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