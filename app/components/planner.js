import '../globals.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { updataLocationDirection } from '../slice/planningSlice'




// 函數：添加時間（小時和分鐘）
function addTime(startTime, hoursToAdd, minutesToAdd) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    let newMinutes = startMinutes + minutesToAdd;
    let newHours = startHours + hoursToAdd + Math.floor(newMinutes / 60);
    newMinutes %= 60;

    // 格式化時間：確保小時和分鐘都是兩位數
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}


function Route() {

    const [plannerDate, setPlannerDate] = useState(new Date().toISOString().split('T')[0]);
    const [plannerTime, setPlannerTime] = useState("08:00")
    const [planner, setPlanner] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const previousLengthRef = useRef();

    //取得 planning資料
    const addNewLocation = useSelector((state) => {
        console.log(state.planning.locations)
        return state.planning.locations
    })

    //日期改變
    const handleDateChange = (event) => {
        setPlannerDate(event.target.value)
    }

    //時間改變
    const handleTimeChange = (event) => {
        setPlannerTime(event.target.value)
    }


    //放入planner 陣列
    useEffect(() => {
        setPlanner(addNewLocation)
    }, [addNewLocation])


    //刪除地點
    const handleDeleteLocation = (event) =>{
        
    }


    // for (let i = 0; i < addNewLocation.length - 1; i++) {
    //     const star = addNewLocation[i];
    //     const end = addNewLocation[i + 1];
    //     const coordinatesStar = [star.lng, star.lat];
    //     const coordinatesEnd = [end.lng, end.lat];
    //     }


    useEffect(() => {

        const fetchData = async () => {
            
           //判斷是否執行fetch
            const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';
            const lastIndex = addNewLocation.length-1;//最後的位置
            // 如果planning 資料大於2 就去fetch
            if (lastIndex >= 1) {
                    dispatch(updataLocationDirection({ index: lastIndex-1, isLoading: true }));

                    const star = addNewLocation[lastIndex-1];
                    const end = addNewLocation[lastIndex];
                    const coordinatesStar = [star.lng, star.lat];
                    const coordinatesEnd = [end.lng, end.lat];

                    const url = 'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson';
                    const body = JSON.stringify({ "coordinates": [coordinatesStar, coordinatesEnd], "elevation": "true", "extra_info": ["steepness"] })
                    try {

                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                                'Content-Type': 'application/json',
                                'Authorization': openRouteServiceApi
                            },
                            body: body
                        });

                        const data = await response.json();
                        if (data.error) {
                            // 如果返回的數據包含錯誤信息，也拋出錯誤
                            const errorInfo = {
                                code: data.error.code,
                                message: data.error.message
                            }
                            throw errorInfo;
                        } else {
                            const distance = data.features[0].properties.segments[0].distance;//距離
                            const kilometers = (distance / 1000).toFixed(1);;
                            const ascent = Math.round(data.features[0].properties.segments[0].ascent);//上升
                            const descent = Math.round(data.features[0].properties.segments[0].descent);//下將
                            const path = data.features[0].geometry.coordinates;
                            const ascentTimePerHour = 300; // 每上升 300 米增加 1 小時的行走時間

                            // 計算總共需要的行走時間（以小時為單位）
                            let totalTime = distance / 5000; // 每 5 公里（約3.1英里）增加 1 小時的基本行走時間
                            totalTime += ascent / ascentTimePerHour; // 加上爬升需要的額外時間
                            const hours = Math.floor(totalTime); // 獲得完整小時數
                            const minutes = Math.round((totalTime - hours) * 60); // 將小數部分轉換為分鐘
                            const duration = totalTime.toFixed(2);//期間


                            // console.log('Total Walking Time:', totalTime.toFixed(2), 'hours');

                            const newDirection = {
                                path: path, kilometers: kilometers, duration: duration, ascent: ascent, descent: descent, hours: hours, minutes: minutes

                            }

                            console.log(newDirection);
                            // 放入特定index path
                            dispatch(updataLocationDirection({ index: lastIndex-1, direction: newDirection , isLoading: false }))
                            //fetch 晚成顯示
                            
                        }



                    } catch (error) {
                        console.error('Error:', error);
                        // 判斷錯誤是來自網絡問題還是 API 響應
                        if (error.code = "2010") {
                            Swal.fire({
                                title: '錯誤! 無法找到可用路徑',
                                text: `Error: ${error.message}`,
                                icon: 'error',
                                confirmButtonText: '好的',
                                confirmButtonColor: '#5B6E60',
                                customClass: {
                                    confirmButton: 'custom-button',
                                    title: 'text-2xl',
                                    text: 'text-base'
                                },
                            });
                        } else if (error.code = "2004") {
                            Swal.fire({
                                title: '錯誤! 超出距離搜尋範圍',
                                text: `Error: ${error.message}`,
                                icon: 'error',
                                confirmButtonText: '好的',
                                confirmButtonColor: '#5B6E60',

                                customClass: {
                                    confirmButton: 'custom-button',
                                    title: 'text-2xl',
                                    text: 'text-base'
                                },
                            });

                        } else {
                            Swal.fire({
                                title: '錯誤!',
                                text: `Error: ${error.message}`,
                                icon: 'error',
                                confirmButtonText: '好的',
                                confirmButtonColor: '#5B6E60',
                                customClass: {
                                    confirmButton: 'custom-button',
                                    title: 'text-2xl',
                                    text: 'text-base'
                                },
                            });


                        }
                        
                    }
                

            }
        };
 

        //藉由計算長度看要不要 fetchData
        if (previousLengthRef.current !== addNewLocation.length) {
            // 新位置被添加，進行操作
            console.log("addNewLocation.a" + addNewLocation.length)
            console.log("previousLengthRef.a" + previousLengthRef.current)
            fetchData();
        }
        // 更新 ref 為當前數組長度 
        previousLengthRef.current = addNewLocation.length;
        console.log("addNewLocation.b" + addNewLocation.length)
        console.log("previousLengthRef.b" + previousLengthRef.current)

    }, [addNewLocation.length])





    return (
        <div className='flex flex-col mt-10 mr-5 w-380 '>
            <div className='bg-F5F2ED p-5 rounded h-70 overflow-y-scroll'>
                <div className='flex mb-5 justify-center'>
                    <div className='flex flex-col mb-2'>
                        <label className='co-434E4E font-medium '>路線名稱</label>
                        <input className='mr-2.5'></input>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label className='co-434E4E font-medium'>開始日期</label>
                        <input
                            type='date'
                            value={plannerDate}
                            onChange={handleDateChange}
                        ></input>
                    </div>
                </div>
                <hr className='mb-2' />
                {addNewLocation && (<div className='pb-2'>

                    <p className='co-005264 font-bold text-center mb-2'>-- 第一天 --  {plannerDate}
                        <input
                            className='w-32 bg-F5F2ED px-1'
                            type='time'
                            value={plannerTime}
                            onChange={handleTimeChange}
                        /></p>


                    {planner.map((location, index) => {
                        // 計算每個地點的預計到達時間
                        let locationTime = plannerTime;


                        for (let i = 0; i < index; i++) {
                            if (addNewLocation[i] && addNewLocation[i].direction) {
                                // 檢查 hours 和 minutes 是否為有效數字
                                if (!isNaN(addNewLocation[i].direction.hours) && !isNaN(addNewLocation[i].direction.minutes)) {
                                    locationTime = addTime(locationTime, addNewLocation[i].direction.hours, addNewLocation[i].direction.minutes);
                                }
                            }
                        }

                        return (<div key={index}>
                            <div className='flex space-x-3'>
                                <div className='w-8 h-8 bg-739A65 text-xl text-white flex items-center justify-center rounded '>{index + 1}</div>
                                <p className="text-center flex items-center bg-005264 text-white rounded px-1 ">{locationTime}</p>
                                <input className='w-44'
                                    type='text'
                                    defaultValue={`${addNewLocation[index]?.name}/${addNewLocation[index]?.region}`}
                                />
                                <button className='w-8 p-0' id={index} ><img src='/delete.png' alt='mountain banner' ></img></button>

                            </div>


                            {index < addNewLocation.length - 1 && (
                                addNewLocation[index].isLoading ? (
                                    <div>計算數據中...</div>
                                ) : (
                                    addNewLocation[index].direction ? (<div className='co-646564 border-l-2 border-slate-300 ml-3 mb-2'>
                                        <div className='ml-9 mt-2'>
                                            <p>行走時間：{addNewLocation[index]?.direction.hours} 小時 {addNewLocation[index]?.direction.minutes} 分鐘</p>
                                            <p>距離：{addNewLocation[index]?.direction.kilometers} km </p>
                                            <p>總爬升高度：{addNewLocation[index]?.direction.ascent} m</p>
                                            <p>總下降高度：{addNewLocation[index]?.direction.descent} m</p>
                                        </div>
                                    </div>) : null

                                )
                            )}

                        </div>);




                    })}

                    <div className='flex justify-end'>
                        <button className='bg-5B6E60 text-white w-28 mt-4 '>新增下一天</button>
                    </div>

                </div>)}



            </div>
            <div className='flex justify-between mt-5'>
                <button className='bg-005264 w-32 text-white'>儲存</button>
                <button className='bg-6697A2 w-32 text-white'>匯出 GPX</button>
            </div>

        </div >
    )
}



export default Route