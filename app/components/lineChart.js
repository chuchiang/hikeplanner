import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { useState } from 'react';
import '../globals.css'
import { addCoordinates ,clearCoordinates} from '../slice/coordinatesSlice';
import{useDispatch}from'react-redux';


//hover 線條
const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDatasetsDraw: function (chart, args, options) {
        const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
        // if (chart.tooltip._active && chart.tooltip._active.length) {
        if (chart.tooltip && chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.tooltip._active[0];
            const xCoord = activePoint.element.x;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xCoord, top);
            ctx.lineTo(xCoord, bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // 修改线条颜色和透明度
            ctx.stroke();
            ctx.restore();
        }
    }
};

ChartJS.register(verticalLinePlugin);


//外框
const customBorderPlugin = {
    id: 'customBorderPlugin',
    afterDraw: function(chart, args, options) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;

        // 设置边框的样式
        ctx.save();
        ctx.strokeStyle = 'gray'; // 可以设置为任何颜色
        ctx.lineWidth = 1; // 设置边框的宽度

        // 绘制矩形边框
        ctx.strokeRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.restore();
    }
};
ChartJS.register(customBorderPlugin);


const ElevationChart = () => {

    const dispatch = useDispatch()

    // 使用useState管理图表数据
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: '海拔 (m)',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    });

    const handleMouseOut = () => {
        dispatch(clearCoordinates()); // 清空 Redux 中的坐标
    };




    const data = useSelector((state) => {
        console.log(state.planning)
        return state.planning.days
    });

    let [totalDistance, setTotalDistance] = useState(0);

    const handleClick = () => {

        // 在这里先声明并初始化distances和elevations数组
        let distances = [0]; // 起始距离为0
        let elevations = []; // 海拔数组
        let lastDistance = 0; // 上一段的最后距离

        // 遍历数据以填充距离和海拔数组
        console.log(data)



        data.forEach(day => {
            day.locations.forEach(location => {
                if (location.direction && location.direction.path) {
                    // 计算段距离
                    const segmentDistances = calculateDistances(location.direction.path);

                    // 将新计算的距离累加到总距离数组中
                    distances = distances.concat(segmentDistances.slice(1).map(d => d + lastDistance));

                    // 更新最后一个距离
                    lastDistance = distances[distances.length - 1];

                    // 合并海拔数据到总海拔数组中
                    elevations = elevations.concat(location.direction.path.map(point => point[2]));
                }
            });
        });

        // 使用计算好的distances和elevations来更新图表数据
        setChartData({
            labels: distances.map(distance => distance.toFixed(1)),
            datasets: [{
                label: '海拔 (m)',
                data: elevations,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
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
            // last = (distances[distances.length - 1])
            // console.log(distances)
            // console.log(last)
        }
        return distances.map(distance => parseFloat(distance.toFixed(1))); // 保留一位小数
    }



    const options = {
        scales: {
            y: {
                grid: {
                    drawBorder: true, // 确保绘制边框
                },
                beginAtZero: true,
                title: {
                    display: true,
                    text: '海拔 (m)'
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
            x: {
                grid: {
                    drawBorder: true, // 确保绘制边框
                },
                title: {
                    display: true,
                    text: '公里 (km)'
                },

                padding: {
                    right: 10,
                    left: 10
                },
                ticks: {
                    maxTicksLimit: 20, // 限制最大标签数量为20
                }
            }
        },

        layout: {
            padding: {
                right: 20 // 在右侧添加额外的空间
            }
        },
        plugins: {
            tooltip: {
                // 自定义提示信息
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let index = context.dataIndex;
                        const elevation = context.dataset.data[index]; // 获取海拔值  6

                        let locationIndex = 0;
                        let day = 0;
                        try {

                            let dayFound = false;
                            for (let d = 0; d < data.length; d++) {// day
                                // let dayLength = data.length - 1;
                                if (dayFound) {
                                    break;
                                }
                                for (let i = 0; i < data[d].locations.length - 1; i++) { // 
                                    let locatinoPathLength = data[d].locations[i].direction.path.length - 1;
                                    // let locaationFirstPathLength = data[d].locations[0].direction.path.length;

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
                        const latLng = data[day].locations[locationIndex].direction.path[index]; // 获取经纬度


                        const lat = latLng[1].toFixed(6); // 保留六位小数
                        const lng = latLng[0].toFixed(6); // 保留六位小数

                        dispatch(addCoordinates({'lng':lng,'lat':lat}))

                        return `context.dataIndex:${context.dataIndex}, index${index}, 經度: ${lng}, 緯度: ${lat}, 公里: ${context.label} km, 海拔: ${elevation} m`;
                    }
                }
            },
            verticalLinePlugin: {}

        },
        elements: {
            line: {
                tension: 0.1 // 设置曲线的弯曲程度
            },
            point: {
                radius: 0 // 设置点的大小为0，以隐藏它们
            }
        }
    };





    return <div className='p-4 '>
        < button className='bg-5B6E60 text-white w-28 ' onClick={handleClick} > 海拔剖面圖</button>

        <Line className='w-auto' data={chartData} options={options} onMouseOut={handleMouseOut}></Line>
    </div >
}

export default ElevationChart;