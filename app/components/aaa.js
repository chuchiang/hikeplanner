import '../globals.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { updataLocationDirection, deleteLocation, addDay, changeDate } from '../slice/planningSlice'




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

    const [plannerTime, setPlannerTime] = useState("08:00")
    const [isLoading, setIsLoading] = useState(true);
    const [deletedIndex, setDeletedIndex] = useState(null);

    const dispatch = useDispatch();
    const previousLocationsRef = useRef();

    //取得 planning資料
    const addNewLocation = useSelector((state) => {
        console.log(state.planning.days)
        return state.planning.days
    })

    //日期改變
    const handleDateChange = (event) => {
        const newDate = event.target.value
        dispatch(changeDate(newDate))
    }

    //時間改變
    const handleTimeChange = (event) => {
        setPlannerTime(event.target.value)
    }

    //刪除事件
    const handleDeleteLocation = (index) => () => {
        dispatch(deleteLocation(index));
        setDeletedIndex(index)
        if (index === 0 && index == addNewLocation.length - 1) {
            setDeletedIndex(null)
        }
        console.log(addNewLocation)
    };

    // 新加天數
    const addNewDay = () => {
        // 得到最一天日期
        const lastDay = addNewLocation[addNewLocation.length - 1]
        const lastDayDate = lastDay.date

        const plannerDateObject = new Date(lastDayDate);

        // 为 plannerDate 增加一天
        plannerDateObject.setDate(plannerDateObject.getDate() + 1);
        console.log(plannerDateObject)

        // 将新日期转换回 YYYY-MM-DD 格式
        const newDate = plannerDateObject.toISOString().split('T')[0];

        // 获取最后一天的最后一个地点
        // const lastDay = addNewLocation[addNewLocation.length - 1];
        const lastDayLocation = lastDay.locations[lastDay.locations.length - 1];

        // 分发 action 增加新的一天
        dispatch(addDay({
            date: newDate,
            locations: lastDayLocation
        }));
    };




    // for (let i = 0; i < addNewLocation.length - 1; i++) {
    //     const star = addNewLocation[i];
    //     const end = addNewLocation[i + 1];
    //     const coordinatesStar = [star.lng, star.lat];
    //     const coordinatesEnd = [end.lng, end.lat];
    //     }


    // 函數來比較 addNewLocation 中每個物件的 locations 長度
    function didLocationsLengthChange(newLocations, oldLocations) {
        if (newLocations.length !== oldLocations.length) {
            return true; // 整個陣列長度變化
        }

        return newLocations.some((newLocation, index) => {
            const oldLocation = oldLocations[index];
            // 比較單個物件中 locations 數組的長度
            return newLocation.locations.length !== oldLocation.locations.length;
        });
    }



    useEffect(() => {

        // locations 長度發生變化的邏輯
        if (previousLocationsRef.current && didLocationsLengthChange(addNewLocation, previousLocationsRef.current)) {
            //判斷是否執行fetch
            const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';
            // const lastDayDirection = addNewLocation[addNewLocation.length-1].locations.direction // 最後一天的locations
            // const lastIndex = lastDayDirection.length - 1;//最後的位置

            const lastDay = addNewLocation[addNewLocation.length - 1]//最後一天
            const lastDayLoctionIndex = lastDay.locations.length - 1//最後一天最後一個地點index



            // 如果planning 資料大於2 就去fetch
            const fetchData = async (coordinatesStar, coordinatesEnd) => {

                // ... 現有的 fetchData 邏輯 ...
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
                        const rawAscent = data.features[0].properties.segments[0].ascent;//上升
                        const ascent = isNaN(rawAscent) ? 0 : Math.round(rawAscent);//上升
                        const rawDescent = data.features[0].properties.segments[0].descent;
                        const descent = isNaN(rawDescent) ? 0 : Math.round(rawDescent)
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
                        if (deletedIndex !== null) {
                            dispatch(updataLocationDirection({ index: deletedIndex - 1, direction: newDirection, isLoading: false }))
                            setDeletedIndex(null)
                        } else {
                            dispatch(updataLocationDirection({ index: lastDayLoctionIndex - 1, direction: newDirection, isLoading: false }))
                        }

                    }


                } catch (error) {
                    console.error('Error:', error);
                    // 若是路徑錯誤把已經加入的刪除
                    dispatch(deleteLocation(lastIndex));
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
            };

            //確認addNewLocation是不是空的
            if (addNewLocation && addNewLocation.length > 0) {
                //確認lastDay location是不是空
                if (lastDay.locations && lastDay.locations.length >= 2) {
                    //取得最後一天最後一個地點
                    // 發生添加操作
                    dispatch(updataLocationDirection({ index: lastDayLoctionIndex - 1, isLoading: true }));
                    const lastLocation = lastDay.locations[lastDayLoctionIndex]
                    const secondLastLocation = lastDay.locations[lastDayLoctionIndex - 1]
                    const star = secondLastLocation
                    const end = lastLocation
                    const coordinatesStar = [star.lng, star.lat];
                    const coordinatesEnd = [end.lng, end.lat];
                    fetchData(coordinatesStar, coordinatesEnd);
                }
            }


            // if (lastDayLocation.length > 1) {
            //     if (addNewLocation.length > previousLocationsRef.current.length) {

            //         // 發生添加操作
            //         dispatch(updataLocationDirection({ index: lastIndex - 1, isLoading: true }));
            //         const star = lastDayLocation[lastIndex - 1];
            //         const end = lastDayLocation[lastIndex];
            //         const coordinatesStar = [star.lng, star.lat];
            //         const coordinatesEnd = [end.lng, end.lat];
            //         fetchData(coordinatesStar, coordinatesEnd);

            //     } else if (lastDayLocation.length < previousLocationsRef.current.length) {
            //         // // 發生刪除操作
            //         // // 重新計算被影響的路徑

            //         let star, end;
            //         //頭尾不需要重新操作
            //         if (deletedIndex === 0 || deletedIndex === previousLocationsRef.current.length - 1) {
            //             setDeletedIndex(null)

            //         } else {
            //             // 刪除中間的點
            //             dispatch(updataLocationDirection({ index: deletedIndex - 1, isLoading: true }));
            //             star = lastDayLocation[deletedIndex - 1];
            //             end = lastDayLocation[deletedIndex];
            //         }

            //         if (star && end) {
            //             const coordinatesStar = [star.lng, star.lat];
            //             const coordinatesEnd = [end.lng, end.lat];
            //             fetchData(coordinatesStar, coordinatesEnd);
            //         }

            //     }
            // }
        }

        // 更新參考以追蹤當前陣列狀態
        previousLocationsRef.current = addNewLocation;
    }, [addNewLocation]);




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
                            value={addNewLocation[0].date}
                            onChange={handleDateChange}
                        ></input>
                    </div>
                </div>
                <hr className='mb-2' />
                {addNewLocation.map((day, dayIndex) => {

                    //計算日期
                    return (
                        <div key={dayIndex} className='pb-2'>
                            {day.date && (
                                <p className='co-005264 font-bold text-center mb-2'>-- 第{dayIndex + 1}天 --  {day.date}
                                    <input
                                        className='w-32 bg-F5F2ED px-1'
                                        type='time'
                                        value={plannerTime}
                                        onChange={handleTimeChange}
                                    /></p>)}
                            {day.locations.map((attraction, index) => {
                                //計算景點時間

                                console.log(attraction)
                                let locationTime = plannerTime;


                                // 如果當前景點不是第一個，有 direction 就累加時間
                                if (index > 0 && day.locations[index - 1].direction) {
                                    const prevDirection = day.locations[index - 1].direction;
                                    if (!isNaN(prevDirection.hours) && !isNaN(prevDirection.minutes)) {
                                        locationTime = addTime(locationTime, prevDirection.hours, prevDirection.minutes);
                                    }
                                }


                                return (<div key={`${dayIndex}-${index}`} >
                                    {/* 地點訊息 */}
                                    <div className='flex space-x-3'>
                                        <div className='w-8 h-8 bg-739A65 text-xl text-white flex items-center justify-center rounded '>{index + 1}</div>
                                        <p className="text-center flex items-center bg-005264 text-white rounded px-1">{locationTime}</p>
                                        <input className='w-44' type='text' defaultValue={`${attraction.name}/${attraction.region}`} />
                                        <button className='w-8 p-0' onClick={() => handleDeleteLocation(dayIndex, index)}><img src='/delete.png' alt='delete icon' /></button>
                                    </div>

                                    {/* 路線訊息 */}


                                    {attraction.isLoading ? (
                                        <div>計算數據中...</div>
                                    ) : (
                                        attraction.direction ? (<div className='co-646564 border-l-2 border-slate-300 ml-3 mb-2'>
                                            <div className='ml-9 mt-2'>
                                                <p>行走時間：{attraction.direction.hours} 小時 {attraction.direction.minutes} 分鐘</p>
                                                <p>距離：{attraction.direction.kilometers} km </p>
                                                <p>總爬升高度：{attraction.direction.ascent} m</p>
                                                <p>總下降高度：{attraction.direction.descent} m</p>
                                            </div>
                                        </div>) : null

                                    )
                                    }
                                </div>)






                            })}
                            {day.locations && day.locations.length >= 2 && (
                                <div className='flex justify-end'>
                                    <button onClick={addNewDay} className='bg-5B6E60 text-white w-28 mt-4 '>新增下一天</button>
                                </div>

                            )}
                        </div>)
                })}






            </div>
            <div className='flex justify-between mt-5'>
                <button className='bg-005264 w-32 text-white'>儲存</button>
                <button className='bg-6697A2 w-32 text-white'>匯出 GPX</button>
            </div>

        </div >
    )


}



export default Route

// useEffect(() => {
    //     //判斷是否執行fetch
    //     const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';
    //     const lastDayLocation = addNewLocation[addNewLocation.length-1] // 最後一個數組
    //     const lastIndex = addNewLocation.length - 1;//最後的位置
        
    //     // 如果planning 資料大於2 就去fetch
    //     const fetchData = async (coordinatesStar, coordinatesEnd) => {

    //         // ... 現有的 fetchData 邏輯 ...
    //         const url = 'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson';
    //         const body = JSON.stringify({ "coordinates": [coordinatesStar, coordinatesEnd], "elevation": "true", "extra_info": ["steepness"] })
    //         try {

    //             const response = await fetch(url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    //                     'Content-Type': 'application/json',
    //                     'Authorization': openRouteServiceApi
    //                 },
    //                 body: body
    //             });

    //             const data = await response.json();
    //             if (data.error) {
    //                 // 如果返回的數據包含錯誤信息，也拋出錯誤
    //                 const errorInfo = {
    //                     code: data.error.code,
    //                     message: data.error.message
    //                 }
    //                 throw errorInfo;
    //             } else {
    //                 const distance = data.features[0].properties.segments[0].distance;//距離
    //                 const kilometers = (distance / 1000).toFixed(1);;
    //                 const rawAscent = data.features[0].properties.segments[0].ascent;//上升
    //                 const ascent = isNaN(rawAscent) ? 0 : Math.round(rawAscent);//上升
    //                 const rawDescent = data.features[0].properties.segments[0].descent;
    //                 const descent = isNaN(rawDescent) ? 0 : Math.round(rawDescent)
    //                 const path = data.features[0].geometry.coordinates;
    //                 const ascentTimePerHour = 300; // 每上升 300 米增加 1 小時的行走時間

    //                 // 計算總共需要的行走時間（以小時為單位）
    //                 let totalTime = distance / 5000; // 每 5 公里（約3.1英里）增加 1 小時的基本行走時間
    //                 totalTime += ascent / ascentTimePerHour; // 加上爬升需要的額外時間
    //                 const hours = Math.floor(totalTime); // 獲得完整小時數
    //                 const minutes = Math.round((totalTime - hours) * 60); // 將小數部分轉換為分鐘
    //                 const duration = totalTime.toFixed(2);//期間


    //                 // console.log('Total Walking Time:', totalTime.toFixed(2), 'hours');

    //                 const newDirection = {
    //                     path: path, kilometers: kilometers, duration: duration, ascent: ascent, descent: descent, hours: hours, minutes: minutes

    //                 }

    //                 console.log(newDirection);
    //                 // 放入特定index path
    //                 if (deletedIndex !== null ) {
    //                     dispatch(updataLocationDirection({ index: deletedIndex - 1, direction: newDirection, isLoading: false }))
    //                     setDeletedIndex(null)
    //                 } else {
    //                     dispatch(updataLocationDirection({ index: lastIndex - 1, direction: newDirection, isLoading: false }))
    //                 }

    //             }


    //         } catch (error) {
    //             console.error('Error:', error);
    //             // 若是路徑錯誤把已經加入的刪除
    //             dispatch(deleteLocation(lastIndex));
    //             if (error.code = "2010") {
    //                 Swal.fire({
    //                     title: '錯誤! 無法找到可用路徑',
    //                     text: `Error: ${error.message}`,
    //                     icon: 'error',
    //                     confirmButtonText: '好的',
    //                     confirmButtonColor: '#5B6E60',
    //                     customClass: {
    //                         confirmButton: 'custom-button',
    //                         title: 'text-2xl',
    //                         text: 'text-base'
    //                     },
    //                 });
    //             } else if (error.code = "2004") {
    //                 Swal.fire({
    //                     title: '錯誤! 超出距離搜尋範圍',
    //                     text: `Error: ${error.message}`,
    //                     icon: 'error',
    //                     confirmButtonText: '好的',
    //                     confirmButtonColor: '#5B6E60',

    //                     customClass: {
    //                         confirmButton: 'custom-button',
    //                         title: 'text-2xl',
    //                         text: 'text-base'
    //                     },
    //                 });

    //             } else {
    //                 Swal.fire({
    //                     title: '錯誤!',
    //                     text: `Error: ${error.message}`,
    //                     icon: 'error',
    //                     confirmButtonText: '好的',
    //                     confirmButtonColor: '#5B6E60',
    //                     customClass: {
    //                         confirmButton: 'custom-button',
    //                         title: 'text-2xl',
    //                         text: 'text-base'
    //                     },
    //                 });


    //             }

    //         }
    //     };


    //     if (addNewLocation.length > 1) {
    //         if (addNewLocation.length > previousLocationsRef.current.length) {

    //             // 發生添加操作
    //             dispatch(updataLocationDirection({ index: lastIndex - 1, isLoading: true }));
    //             const star = addNewLocation[lastIndex - 1];
    //             const end = addNewLocation[lastIndex];
    //             const coordinatesStar = [star.lng, star.lat];
    //             const coordinatesEnd = [end.lng, end.lat];
    //             fetchData(coordinatesStar, coordinatesEnd);

    //         } else if (addNewLocation.length < previousLocationsRef.current.length) {
    //             // // 發生刪除操作
    //             // // 重新計算被影響的路徑

    //             let star, end;
    //             //頭尾不需要重新操作
    //             if (deletedIndex === 0 || deletedIndex === previousLocationsRef.current.length - 1) {
    //                 setDeletedIndex(null)

    //             } else {
    //                 // 刪除中間的點
    //                 dispatch(updataLocationDirection({ index: deletedIndex - 1, isLoading: true }));
    //                 star = addNewLocation[deletedIndex - 1];
    //                 end = addNewLocation[deletedIndex];
    //             }

    //             if (star && end) {
    //                 const coordinatesStar = [star.lng, star.lat];
    //                 const coordinatesEnd = [end.lng, end.lat];
    //                 fetchData(coordinatesStar, coordinatesEnd);
    //             }

    //         }
    //     }

    //     // 更新參考以追蹤當前陣列狀態
    //     previousLocationsRef.current = addNewLocation;
    // }, [addNewLocation.length]);

// {/* {addNewLocation.map((location, index) => {
//                         // 計算每個地點的預計到達時間
//                         let locationTime = plannerTime;


//                         for (let i = 0; i < index; i++) {
//                             if (addNewLocation[i] && addNewLocation[i].direction) {
//                                 // 檢查 hours 和 minutes 是否為有效數字
//                                 if (!isNaN(addNewLocation[i].direction.hours) && !isNaN(addNewLocation[i].direction.minutes)) {
//                                     locationTime = addTime(locationTime, addNewLocation[i].direction.hours, addNewLocation[i].direction.minutes);
//                                 }
//                             }
//                         }

//                         return (<div key={`${location.lng}-${location.lat}`}>

//                             <div className='flex space-x-3'>
//                                 <div className='w-8 h-8 bg-739A65 text-xl text-white flex items-center justify-center rounded '>{index + 1}</div>
//                                 <p className="text-center flex items-center bg-005264 text-white rounded px-1 ">{locationTime}</p>
//                                 <input className='w-44'
//                                     type='text'
//                                     defaultValue={`${addNewLocation[index]?.name}/${addNewLocation[index]?.region}`}
//                                 />
//                                 <button className='w-8 p-0' id={index} onClick={handleDeleteLocation(index)}><img src='/delete.png' alt='mountain banner' ></img></button>

//                             </div>
//                             {index < addNewLocation.length - 1 && (
//                                 addNewLocation[index].isLoading ? (
//                                     <div>計算數據中...</div>
//                                 ) : (
//                                     addNewLocation[index].direction ? (<div className='co-646564 border-l-2 border-slate-300 ml-3 mb-2'>
//                                         <div className='ml-9 mt-2'>
//                                             <p>行走時間：{addNewLocation[index]?.direction.hours} 小時 {addNewLocation[index]?.direction.minutes} 分鐘</p>
//                                             <p>距離：{addNewLocation[index]?.direction.kilometers} km </p>
//                                             <p>總爬升高度：{addNewLocation[index]?.direction.ascent} m</p>
//                                             <p>總下降高度：{addNewLocation[index]?.direction.descent} m</p>
//                                         </div>
//                                     </div>) : null

//                                 )
//                             )}
//                         </div>);
//                     })} */}



[{
    "date": "2023-11-24",
    "time": "08:00",
    "locations": [
        {
            "id": 2,
            "lat": 23.2927167297288,
            "lng": 121.03452444251161,
            "name": "嘉明湖",
            "region": "台東縣",
            "direction": {
                "path": [
                    [
                        121.028439,
                        23.295571,
                        3375.4
                    ],
                    [
                        121.028859,
                        23.295576,
                        3378.2
                    ],
                    [
                        121.029263,
                        23.295648,
                        3383.2
                    ],
                    [
                        121.029762,
                        23.295885,
                        3392.8
                    ],
                    [
                        121.030288,
                        23.296054,
                        3399
                    ],
                    [
                        121.030793,
                        23.29631,
                        3406.2
                    ],
                    [
                        121.031141,
                        23.296408,
                        3409
                    ],
                    [
                        121.031534,
                        23.296455,
                        3409.6
                    ],
                    [
                        121.032241,
                        23.296425,
                        3402.5
                    ],
                    [
                        121.033131,
                        23.295619,
                        3381.3
                    ],
                    [
                        121.033749,
                        23.295315,
                        3363.3
                    ],
                    [
                        121.034019,
                        23.294995,
                        3353.7
                    ],
                    [
                        121.034315,
                        23.294459,
                        3343
                    ],
                    [
                        121.034465,
                        23.294065,
                        3338.2
                    ],
                    [
                        121.034669,
                        23.293756,
                        3334.8
                    ],
                    [
                        121.034661,
                        23.293614,
                        3334.1
                    ],
                    [
                        121.0346,
                        23.293461,
                        3333.4
                    ],
                    [
                        121.034596,
                        23.293304,
                        3332.7
                    ],
                    [
                        121.034641,
                        23.293211,
                        3331.8
                    ],
                    [
                        121.034467,
                        23.293028,
                        3329.9
                    ],
                    [
                        121.03438,
                        23.292805,
                        3328.2
                    ],
                    [
                        121.034375,
                        23.292797,
                        3327.4
                    ]
                ],
                "kilometers": "0.9",
                "duration": "0.30",
                "ascent": 34,
                "descent": 82,
                "hours": 0,
                "minutes": 18
            },
            "isLoading": false
        },
        {
            "id": 2,
            "lat": 23.296185433331992,
            "lng": 121.0284304636298,
            "name": "三叉山",
            "region": "台東縣"
        }
    ]
},
{
    "date": "2023-11-25",
    "locations": [
        {
            "id": 2,
            "lat": 23.296185433331992,
            "lng": 121.0284304636298,
            "name": "三叉山",
            "region": "台東縣",
            "direction": {
                "path": [
                    [
                        121.028439,
                        23.295571,
                        3375.4
                    ],
                    [
                        121.027848,
                        23.295564,
                        3372.6
                    ],
                    [
                        121.027036,
                        23.295144,
                        3378.3
                    ],
                    [
                        121.026377,
                        23.294637,
                        3387.5
                    ],
                    [
                        121.026266,
                        23.294534,
                        3389.3
                    ],
                    [
                        121.025972,
                        23.294329,
                        3394.7
                    ],
                    [
                        121.025606,
                        23.294119,
                        3401.1
                    ],
                    [
                        121.02499,
                        23.293881,
                        3406.9
                    ],
                    [
                        121.024655,
                        23.293887,
                        3408.1
                    ],
                    [
                        121.024364,
                        23.293937,
                        3408.1
                    ],
                    [
                        121.023636,
                        23.294187,
                        3405
                    ],
                    [
                        121.023497,
                        23.294139,
                        3404.2
                    ],
                    [
                        121.023312,
                        23.294121,
                        3403.4
                    ],
                    [
                        121.02309,
                        23.294164,
                        3401.9
                    ],
                    [
                        121.022887,
                        23.294243,
                        3400.5
                    ],
                    [
                        121.022079,
                        23.294085,
                        3388.7
                    ],
                    [
                        121.021782,
                        23.294179,
                        3382.3
                    ],
                    [
                        121.02142,
                        23.294163,
                        3374.7
                    ],
                    [
                        121.021081,
                        23.294219,
                        3366.9
                    ],
                    [
                        121.02028,
                        23.293835,
                        3341.5
                    ],
                    [
                        121.019653,
                        23.293771,
                        3326
                    ],
                    [
                        121.019496,
                        23.293551,
                        3321
                    ],
                    [
                        121.019244,
                        23.293459,
                        3315.6
                    ],
                    [
                        121.0191,
                        23.293311,
                        3310.2
                    ],
                    [
                        121.018843,
                        23.293236,
                        3304.8
                    ],
                    [
                        121.018477,
                        23.29326,
                        3297.6
                    ],
                    [
                        121.01816,
                        23.293347,
                        3291
                    ],
                    [
                        121.017842,
                        23.293212,
                        3285.2
                    ],
                    [
                        121.017472,
                        23.29308,
                        3279.1
                    ],
                    [
                        121.016993,
                        23.29302,
                        3274.5
                    ],
                    [
                        121.016592,
                        23.29316,
                        3271
                    ],
                    [
                        121.016257,
                        23.293244,
                        3268.7
                    ],
                    [
                        121.015957,
                        23.292972,
                        3266.4
                    ],
                    [
                        121.015744,
                        23.292869,
                        3265.3
                    ],
                    [
                        121.01553,
                        23.292812,
                        3264.4
                    ]
                ],
                "kilometers": "1.5",
                "duration": "0.41",
                "ascent": 35,
                "descent": 146,
                "hours": 0,
                "minutes": 25
            },
            "isLoading": false
        },
        {
            "id": 3,
            "lat": 23.292322553143965,
            "lng": 121.01555586035832,
            "name": "迎賓樹",
            "region": "台東縣"
        }
    ],
    "time": "08:00"
},
{
    "date": "2023-11-26",
    "locations": [
        {
            "id": 3,
            "lat": 23.292322553143965,
            "lng": 121.01555586035832,
            "name": "迎賓樹",
            "region": "台東縣",
            "direction": {
                "path": [
                    [
                        120.996949,
                        23.283668,
                        3392
                    ],
                    [
                        120.996961,
                        23.283696,
                        3392
                    ],
                    [
                        120.996941,
                        23.28378,
                        3392
                    ],
                    [
                        120.996885,
                        23.283812,
                        3392
                    ],
                    [
                        120.996871,
                        23.283881,
                        3392
                    ],
                    [
                        120.996828,
                        23.283928,
                        3392
                    ],
                    [
                        120.996875,
                        23.284045,
                        3392
                    ],
                    [
                        120.99694,
                        23.284087,
                        3392
                    ],
                    [
                        120.996938,
                        23.284181,
                        3392
                    ],
                    [
                        120.997085,
                        23.284363,
                        3392
                    ],
                    [
                        120.997227,
                        23.284494,
                        3391.9
                    ],
                    [
                        120.997663,
                        23.285182,
                        3391
                    ],
                    [
                        120.997846,
                        23.285358,
                        3390.6
                    ],
                    [
                        120.997976,
                        23.28567,
                        3390
                    ],
                    [
                        120.998407,
                        23.285851,
                        3389.1
                    ],
                    [
                        120.998616,
                        23.286055,
                        3388.5
                    ],
                    [
                        120.9989,
                        23.2861,
                        3388.2
                    ],
                    [
                        120.998961,
                        23.286153,
                        3388.1
                    ],
                    [
                        120.999097,
                        23.286269,
                        3387.6
                    ],
                    [
                        120.999626,
                        23.286416,
                        3385.3
                    ],
                    [
                        120.999922,
                        23.286303,
                        3383.7
                    ],
                    [
                        121.000463,
                        23.286524,
                        3380.2
                    ],
                    [
                        121.001079,
                        23.286801,
                        3374.4
                    ],
                    [
                        121.001855,
                        23.2874,
                        3363.4
                    ],
                    [
                        121.002261,
                        23.287909,
                        3355.3
                    ],
                    [
                        121.002405,
                        23.288125,
                        3353.6
                    ],
                    [
                        121.002714,
                        23.288405,
                        3351.1
                    ],
                    [
                        121.002918,
                        23.288553,
                        3350.3
                    ],
                    [
                        121.003123,
                        23.288885,
                        3349.8
                    ],
                    [
                        121.003214,
                        23.288965,
                        3350
                    ],
                    [
                        121.003397,
                        23.289241,
                        3350.8
                    ],
                    [
                        121.003585,
                        23.289329,
                        3351.5
                    ],
                    [
                        121.003676,
                        23.289293,
                        3351.9
                    ],
                    [
                        121.004116,
                        23.289445,
                        3354.1
                    ],
                    [
                        121.004442,
                        23.289661,
                        3356.6
                    ],
                    [
                        121.004682,
                        23.289857,
                        3358.6
                    ],
                    [
                        121.004825,
                        23.289925,
                        3359.2
                    ],
                    [
                        121.005465,
                        23.290644,
                        3364.9
                    ],
                    [
                        121.0058,
                        23.290952,
                        3366.6
                    ],
                    [
                        121.006075,
                        23.291128,
                        3367.7
                    ],
                    [
                        121.006323,
                        23.29132,
                        3368.7
                    ],
                    [
                        121.006762,
                        23.29162,
                        3369.3
                    ],
                    [
                        121.007093,
                        23.291548,
                        3369.3
                    ],
                    [
                        121.007276,
                        23.2916,
                        3369.3
                    ],
                    [
                        121.007481,
                        23.291552,
                        3369.5
                    ],
                    [
                        121.007681,
                        23.29148,
                        3370
                    ],
                    [
                        121.008064,
                        23.29158,
                        3371.4
                    ],
                    [
                        121.008395,
                        23.291748,
                        3372.7
                    ],
                    [
                        121.008887,
                        23.291776,
                        3375.7
                    ],
                    [
                        121.008982,
                        23.291812,
                        3376.7
                    ],
                    [
                        121.009575,
                        23.29204,
                        3381.1
                    ],
                    [
                        121.009797,
                        23.292288,
                        3381.6
                    ],
                    [
                        121.01008,
                        23.292388,
                        3381.5
                    ],
                    [
                        121.010167,
                        23.292464,
                        3381.2
                    ],
                    [
                        121.01062,
                        23.292688,
                        3378.3
                    ],
                    [
                        121.010794,
                        23.292896,
                        3376.1
                    ],
                    [
                        121.011107,
                        23.292848,
                        3372.5
                    ],
                    [
                        121.011529,
                        23.29294,
                        3367
                    ],
                    [
                        121.011695,
                        23.292876,
                        3365.3
                    ],
                    [
                        121.012143,
                        23.292964,
                        3357.4
                    ],
                    [
                        121.012309,
                        23.292896,
                        3355
                    ],
                    [
                        121.012809,
                        23.292956,
                        3342.4
                    ],
                    [
                        121.013044,
                        23.292836,
                        3337
                    ],
                    [
                        121.013272,
                        23.292903,
                        3331.1
                    ],
                    [
                        121.013536,
                        23.292932,
                        3325
                    ],
                    [
                        121.013756,
                        23.293,
                        3318.6
                    ],
                    [
                        121.014092,
                        23.29308,
                        3309.2
                    ],
                    [
                        121.014246,
                        23.293045,
                        3306.2
                    ],
                    [
                        121.014442,
                        23.292928,
                        3300.2
                    ],
                    [
                        121.015176,
                        23.292807,
                        3282.3
                    ],
                    [
                        121.01553,
                        23.292812,
                        3275.8
                    ]
                ],
                "kilometers": "2.4",
                "duration": "0.59",
                "ascent": 32,
                "descent": 148,
                "hours": 0,
                "minutes": 35
            },
            "isLoading": false
        },
        {
            "id": 4,
            "lat": 23.28351897192299,
            "lng": 120.99710226233586,
            "name": "嘉明湖避難山屋",
            "region": "台東縣"
        }
    ],
    "time": "08:00"
}]
