import React from 'react';
import { useSelector } from 'react-redux';

const generateGPX = (data) => {
    // gpx 文件標頭
    let gpxData = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="HikePlanner">`;
    
    // 取出data資料
    data.forEach(day => {
    
        // 遍歷每一天中添加 wpt 元素和path，GPX 中的軌跡（trk）元素。此元素包含軌跡段（trkseg）和軌跡點（trkpt）
        day.locations.forEach(location => {
            gpxData += `<wpt lat="${location.lat}" lon="${location.lng}"><name>${location.name}</name></wpt>`;
            if (location.direction && location.direction.path) {
                gpxData += `<trk><name>${location.name}</name><trkseg>`;
                [...location.direction.path].reverse().forEach(point => {
                    gpxData += `<trkpt lat="${point[1]}" lon="${point[0]}"><ele>${point[2]}</ele></trkpt>`;
                });
                gpxData += `</trkseg></trk>`;//結束 GPX 文件的構建
            }
        });
    });
    gpxData += `</gpx>`
    return gpxData;
};



const ExportGpx = () => {

    const plannerData = useSelector((state) => {
        console.log(state.planning.days)
        return state.planning.days
    })

    const handleDownloadGPX = () => {
        const data = plannerData
        const gpxData = generateGPX(data);
        const blob = new Blob([gpxData], { type: 'application/gpx+xml' });// Blob存儲大量數據的對象
        const url = URL.createObjectURL(blob); // 創建URL 存取blob
        const link = document.createElement('a'); // 創建<a> 觸發文件下載
        link.href = url;
        link.download = 'route.gpx';
        document.body.appendChild(link);// <a>元素添加到文檔的 body 中
        link.click();// 觸發文件下載
        document.body.removeChild(link);// 將 <a> 元素從文檔中移除。清理確保不會在文檔中留下不需要的元素
        URL.revokeObjectURL(url);// 釋放之前創建的臨時 Blob URL
    }


    return (
        <>
            <button className='bg-5A748F w-32 text-white hover:bg-4A6075 shadow-md hover:shadow-xl' onClick={handleDownloadGPX} type="button" >匯出 GPX</button>
        </>
    )
}

export default ExportGpx



