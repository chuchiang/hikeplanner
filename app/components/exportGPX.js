import React from 'react';
import { useSelector } from 'react-redux';

const generateGPX = (data) => {
    let gpxData = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="HikePlanner">`;

    //反轉data順序
    data.forEach(day => {
        day.locations.forEach(location => {
            
            if (location.direction && location.direction.path) {
                gpxData += `<trk><name>${location.name}</name><trkseg>`;
                [...location.direction.path].reverse().forEach(point => {
                    gpxData += `<trkpt lat="${point[1]}" lon="${point[0]}"><ele>${point[2]}</ele ></trkpt>`;

                });
                gpxData += `</trkseg></trk>`;//GPX 結構的閉合標籤
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
        const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'route.gpx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }


    return (
        <>
            <button className='bg-6697A2 w-32 text-white' onClick={handleDownloadGPX}>匯出 GPX</button>
        </>
    )
}

export default ExportGpx



