import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useSelector } from 'react-redux';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import { useState, useEffect } from 'react';
import '../globals.css'
import { addCoordinates, clearCoordinates } from '../slice/coordinatesSlice';
import { useDispatch } from 'react-redux';
import { verticalLinePlugin } from '../lib/chartVerticalLine'
import { customBorderPlugin } from '../lib/chartBorder'
ChartJS.register(verticalLinePlugin);//hover 線條
ChartJS.register(customBorderPlugin);//外框


const ElevationChart = () => {

    const dispatch = useDispatch()
    const [showChart, setShowChart] = useState(false);

    // 使用useState管理圖表數據
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: '海拔 (m)',
            data: [],
            fill: true,
            borderColor: 'rgb(158,104,106)',
            backgroundColor: 'rgb(176,144,146,0.5)',
            tension: 0.1
        }]
    });

    const handleMouseOut = () => {
        dispatch(clearCoordinates());
    };


    useEffect(() => {
        const handleGlobalClick = (event) => {
            // 檢查點擊事件是否在圖表或按鈕外部
            if (showChart && !event.target.closest('.chart-container, .chart-button')) {
                setShowChart(false);
            }
        };
        // 全局點擊事件監聽器
        document.addEventListener('click', handleGlobalClick);
        // 清除監聽器
        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [showChart]);


    const data = useSelector((state) => {
        console.log(state.planning)
        return state.planning.days
    });


    const handleClick = () => {
        //顯示chart
        setShowChart(!showChart);

        let distances = [0];
        let elevations = [];
        let lastDistance = 0;


        data.forEach(day => {
            day.locations.forEach(location => {
                if (location.direction && location.direction.path && location.direction.length > 0) {
                    // if (location.direction && location.direction.path) {
                    // 計算段距離
                    const segmentDistances = calculateDistances(location.direction.path);
                    // 新計算距離累加到之前的距離
                    distances = distances.concat(segmentDistances.slice(1).map(d => d + lastDistance));
                    // 更新最後距離
                    lastDistance = distances[distances.length - 1];
                    elevations = elevations.concat(location.direction.path.map(point => point[2]));
                }
            });
        });

        // 使用計算好的distances和elevations更新圖表數據
        setChartData({
            labels: distances.map(distance => distance.toFixed(1)),
            datasets: [{
                display: '海拔 (m)',
                data: elevations,
                fill: true,
                borderColor: 'rgb(158,104,106)',
                backgroundColor: 'rgb(176,144,146,0.5)', // 設置線內顏色
                tension: 0.1
            }]
        });
        console.log(chartData)
    }



    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        let R = 6371;//地球半徑
        let dLat = deg2rad(lat2 - lat1);
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // 距離，單位公里
        return d;
    }


    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }


    function calculateDistances(path) {
        let distances = [0];
        for (let i = 1; i < path.length; i++) {
            const prevPoint = path[i - 1];
            const point = path[i];
            const distance = getDistanceFromLatLonInKm(prevPoint[1], prevPoint[0], point[1], point[0]);
            distances.push(distances[distances.length - 1] + distance);
        }
        return distances.map(distance => parseFloat(distance.toFixed(1)));
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                grid: {
                    drawBorder: true,
                },
                beginAtZero: true,
                title: {
                    display: true,
                    text: '海拔 (m)'
                },

            },
            x: {
                grid: {
                    drawBorder: true,
                },
                title: {
                    display: true,
                    text: '距離 (km)'
                },

                padding: {
                    right: 10,
                    left: 10
                },
                // 限制顯示20
                ticks: {
                    maxTicksLimit: 20,
                }
            }
        },

        layout: {
            padding: {
                right: 5
            }
        },
        plugins: {
            //提示隱藏
            legend: {
                display: false,
            },
            //自訂義tooltip
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let index = context.dataIndex;
                        const elevation = context.dataset.data[index];
                        let locationIndex = 0;
                        let day = 0;
                        try {

                            let dayFound = false;
                            // 計算獲取哪天
                            for (let d = 0; d < data.length; d++) {
                                if (dayFound) {
                                    break;
                                }
                                // 計算獲取哪天的location
                                for (let i = 0; i < data[d].locations.length - 1; i++) {
                                    let locatinoPathLength = data[d].locations[i].direction.path.length - 1;
                                    if (i === 0) {
                                        if ((index - locatinoPathLength) <= 0) {
                                            dayFound = true;
                                            locationIndex = i;
                                            day = d;
                                            break;
                                        } else {
                                            index -= locatinoPathLength;
                                            continue;
                                        }
                                    }
                                    if (index - locatinoPathLength <= 0) {
                                        dayFound = true;
                                        locationIndex = i;
                                        day = d;
                                        break;
                                    }
                                    else {
                                        index -= locatinoPathLength;
                                    }
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                        const latLng = data[day].locations[locationIndex].direction.path[index];
                        const lat = latLng[1].toFixed(6); // 保留六位小数
                        const lng = latLng[0].toFixed(6); // 保留六位小数

                        dispatch(addCoordinates({ 'lng': lng, 'lat': lat }))

                        return ` 經度: ${lng}, 緯度: ${lat}, 公里: ${context.label} km, 海拔: ${elevation} m`;
                        // return `context.dataIndex:${context.dataIndex}, index${index}, 經度: ${lng}, 緯度: ${lat}, 公里: ${context.label} km, 海拔: ${elevation} m`;

                    }
                }
            },
            verticalLinePlugin: {}

        },
        elements: {
            line: {
                tension: 0.1 // 取線灣曲程度
            },
            point: {
                radius: 0 // 點隱藏
            }
        }
    };


    //total 距離時間
    const directionData = useSelector((state) => {
        return state.planning.days
    })

    const total = {
        kilometers: 0.0,
        hours: 0,
        minutes: 0,
        ascent: 0,
        descent: 0
    }

    directionData.forEach(day => {
        day.locations.forEach(location => {
            if (location.direction) {
                console.log(location.direction.kilometers)
                total.kilometers = parseFloat((total.kilometers + parseFloat(location.direction.kilometers)).toFixed(1));
                total.ascent += location.direction.ascent;
                total.descent += location.direction.descent;
                total.hours += location.direction.hours;
                total.minutes += location.direction.minutes;

                while (total.minutes >= 60) {
                    total.hours += 1,
                        total.minutes -= 60
                }
            }
        })
    });





    return <div className='absolute z-1000 bottom-0  w-800'>
        {showChart && (
            <div className='h-50 bg-white chart-container'>
                <Line className='' data={chartData} options={options} onMouseOut={handleMouseOut}></Line>
            </div>)}
        <div className='flex justify-between items-end'>
            <ul className='flex space-x-2 '>
                <li className='co-646564 text-base'>總距離：<br />{total.kilometers}km</li>
                <li className='border-r-2 text-base'></li>
                <li className='co-646564 text-base'>總預估時間：<br />{total.hours}h{total.minutes}min</li>
                <li className='border-r-2'></li>
                <li className='co-646564 text-base'>總爬升高度：<br />{total.ascent}m</li>
                <li className='border-r-2'></li>
                <li className='co-646564 text-base'>總下降高度：<br />{total.descent}m</li>
            </ul>
            < button className='bg-6C8272 hover:bg-5B6E60 shadow-md hover:shadow-xl text-white w-30 chart-button flex items-center' onClick={handleClick} >{showChart ? (<img src='/down.png' className='mr-1'></img>):(<img src='/up.png' className='mr-1' ></img>)}海拔剖面圖</button>
        </div>
    </div >
}

export default ElevationChart;