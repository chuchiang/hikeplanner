import '../../globals.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { addimg, addimgState, updataLocationDirection, deleteLocation, addDay, changeDate, changeTime, addWrongLocation, addRouteName, clearStateAction } from '../../slice/planningSlice'
import ExportGpx from './exportGPX';
import { asyncAddData } from '../../api/firebase/asyncAdd';
import { selectorCurrentUser } from '../../slice/authSlice';
import FullLoading from '../loading/fullLoading'
import Loading from '../loading/areaLoading'; // 確保路徑正確
import LoginForm from '../member/login'

import RegisterForm from '../member/register'

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
    const [isLoading, setIsLoading] = useState(true);
    const [isFullLoading, setIsFullLoading] = useState(false);
    const [deletedIndex, setDeletedIndex] = useState(null);
    const currentUser = useSelector(selectorCurrentUser);

    const addNewImg = useSelector((state) => {
        // console.log(state.planning)
        return state.planning.img
    })

    const dispatch = useDispatch();
    const previousLocationsRef = useRef();

    //取得 planning資料
    const addNewLocation = useSelector((state) => {
        // console.log(state.planning)
        return state.planning.days
    })

    //取得 planning資料
    const addNewPlanning = useSelector((state) => {
        // console.log('addNewPlanning' + state.planning)
        return state.planning
    })
    const [routeName, setRouteName] = useState(addNewPlanning ? addNewPlanning.routeName : '');

    //日期改變
    const handleDateChange = (event) => {
        const newDate = event.target.value
        dispatch(changeDate(newDate))
    }

    //時間改變
    const handleTimeChange = (dayIndex, event) => {
        const newTime = event.target.value;
        dispatch(changeTime({
            dayIndex: dayIndex,
            newTime: newTime
        }))
    }

    //刪除事件
    const handleDeleteLocation = (dayIndex, index) => () => {
        dispatch(deleteLocation({
            deleteDayIndex: dayIndex,
            deleteIndex: index
        }));

        //第一天第一個景點
        const isFirstLocation = dayIndex === 0 && index === 0;

        //某天最後一個且第二天沒有第二個
        const isLastLocationAndNextDayNo =
            index == addNewLocation[dayIndex].locations.length - 1 &&
            dayIndex < addNewLocation.length - 1 &&
            addNewLocation[dayIndex + 1].locations.length === 1

        //某天第一個且第二天沒有第二個
        const isNextDayFirstLocation =
            index === 0 &&
            dayIndex !== 0 &&
            addNewLocation[dayIndex].locations.length == 1

        //某天最後一個且第二天有第二個
        const isLastLocationAndNextDayHave =
            index == addNewLocation[dayIndex].locations.length - 1 &&
            dayIndex < addNewLocation.length - 1 &&
            addNewLocation[dayIndex + 1].locations.length >= 2

        //某天第一個且有第二個
        const isNextDayHaveLocations =
            index == 0 &&
            dayIndex !== 0 &&
            addNewLocation[dayIndex].locations.length > 1;

        //某天最後一個沒有第二天
        const isLastLocationNoNextDay =
            index == addNewLocation[dayIndex].locations.length - 1 &&
            dayIndex == addNewLocation.length - 1

        if (isFirstLocation || isLastLocationAndNextDayNo || isNextDayFirstLocation || isLastLocationNoNextDay) {
            setDeletedIndex(null)
        } else if (isNextDayHaveLocations) {
            const lastone = addNewLocation[dayIndex - 1].locations.length - 1
            setDeletedIndex({ deleteDayIndex: dayIndex - 1, deleteIndex: lastone })
        }
        else {
            setDeletedIndex({ deleteDayIndex: dayIndex, deleteIndex: index })

        }
    };

    // 新加天數
    const addNewDay = () => {
        // 得到最一天日期
        const lastDay = addNewLocation[addNewLocation.length - 1]
        const lastDayDate = lastDay.date
        const plannerDateObject = new Date(lastDayDate);
        plannerDateObject.setDate(plannerDateObject.getDate() + 1);//  plannerDate 增加一天
        const newDate = plannerDateObject.toISOString().split('T')[0];
        const lastDayLocation = lastDay.locations[lastDay.locations.length - 1];

        dispatch(addDay({
            date: newDate,

            locations: lastDayLocation
        }));
    };




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


    // 最短路徑計算
    useEffect(() => {

        // locations 長度發生變化的邏輯
        if (previousLocationsRef.current && didLocationsLengthChange(addNewLocation, previousLocationsRef.current)) {
            //判斷是否執行fetch
            const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';

            // 如果planning 資料大於2 就去fetch
            const fetchData = async (coordinatesStar, coordinatesEnd, dayIndex, locationIndex) => {

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
                        const ascent = isNaN(rawAscent) ? 0 : Math.round(rawAscent);
                        const rawDescent = data.features[0].properties.segments[0].descent;//降下
                        const descent = isNaN(rawDescent) ? 0 : Math.round(rawDescent)
                        const path = data.features[0].geometry.coordinates;
                        const ascentTimePerHour = 300; // 每上升 300 米增加 1 小時的行走時間

                        // 計算總共需要的行走時間（以小時為單位）
                        let totalTime = distance / 5000; // 每 5 公里（約3.1英里）增加 1 小時的基本行走時間
                        totalTime += ascent / ascentTimePerHour; // 加上爬升需要的額外時間
                        const hours = Math.floor(totalTime); // 獲得完整小時數
                        const minutes = Math.round((totalTime - hours) * 60); // 將小數部分轉換為分鐘
                        const duration = totalTime.toFixed(2);//期間
                        const newDirection = {
                            path: path, kilometers: kilometers, duration: duration, ascent: ascent, descent: descent, hours: hours, minutes: minutes

                        }
                        if (deletedIndex && deletedIndex.deleteDayIndex !== undefined) {
                            const deleteLocationDay = deletedIndex.deleteDayIndex;
                            const deleteLocationIndex = deletedIndex.deleteIndex;

                            dispatch(updataLocationDirection({
                                dayIndex: deleteLocationDay,
                                locationIndex: deleteLocationIndex - 1,
                                direction: newDirection,
                                isLoading: false
                            }));
                            setDeletedIndex(null)
                        } else {
                            dispatch(updataLocationDirection({
                                dayIndex: dayIndex,
                                locationIndex: locationIndex,
                                direction: newDirection,
                                isLoading: false
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    //若是路徑錯誤把已經加入的刪除
                    dispatch(addWrongLocation({
                        addWrongLocation: dayIndex,
                        wrongIndex: locationIndex + 1,

                    }));

                    if (error.code = "2010") {
                        Swal.fire({
                            title: '錯誤 無法找到可用路徑',
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
                            title: '錯誤 超出距離搜尋範圍',
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
                            title: '錯誤',
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

            //處理景點變更
            addNewLocation.forEach((day, dayIndex) => {
                const preDev = previousLocationsRef.current[dayIndex]
                //新增加景點
                if (day.locations.length >= 2 && day.locations.length > (preDev ? preDev.locations.length : 0)) {
                    const newLocationIndex = day.locations.length - 1;
                    const lastLocation = day.locations[newLocationIndex - 1];
                    const lastSecondLocation = day.locations[newLocationIndex];
                    const coordinatesStar = [lastLocation.lng, lastLocation.lat];
                    const coordinatesEnd = [lastSecondLocation.lng, lastSecondLocation.lat];
                    fetchData(coordinatesStar, coordinatesEnd, dayIndex, newLocationIndex - 1);
                    dispatch(updataLocationDirection({
                        dayIndex: dayIndex,
                        locationIndex: newLocationIndex - 1,
                        isLoading: true
                    }));
                } else if (deletedIndex !== null) {
                    const deleteLocationDay = deletedIndex.deleteDayIndex
                    const deleteLocationIndex = deletedIndex.deleteIndex
                    const starLocation = addNewLocation[deleteLocationDay].locations[deleteLocationIndex - 1];
                    const endLocation = addNewLocation[deleteLocationDay].locations[deleteLocationIndex];
                    const coordinatesStar = [starLocation.lng, starLocation.lat];
                    const coordinatesEnd = [endLocation.lng, endLocation.lat];
                    fetchData(coordinatesStar, coordinatesEnd, dayIndex);
                    dispatch(updataLocationDirection({
                        dayIndex: deleteLocationDay,
                        locationIndex: deleteLocationIndex - 1,
                        isLoading: true
                    }))
                }
            });
        }

        // 更新參考以追蹤當前陣列狀態
        previousLocationsRef.current = addNewLocation;
    }, [addNewLocation]);

    // 路線名稱Change
    const handleRouteNameChange = (e) => {
        setRouteName(e.target.value);
        dispatch(addRouteName(e.target.value))
    }

    //資料轉換
    const transformDataForFirestore = (data) => {
        return data.map(day => ({
            ...day,
            locations: day.locations.map(location => ({
                ...location,
                direction: location.direction ? {
                    ...location.direction,
                    path: location.direction.path.map(coord => ({
                        lon: coord[0],
                        lat: coord[1],
                        ele: coord[2],
                    }))
                } : ""
            }))
        }))
    }

    //計算總行走時間
    function calculateTotal(directionData) {
        const total = {
            kilometers: 0.0,
            hours: 0,
            minutes: 0,
            ascent: 0,
            descent: 0
        };

        directionData.forEach(day => {
            day.locations.forEach(location => {
                if (location.direction) {
                    total.kilometers = parseFloat((total.kilometers + parseFloat(location.direction.kilometers)).toFixed(1));
                    total.ascent += location.direction.ascent;
                    total.descent += location.direction.descent;
                    total.hours += location.direction.hours;
                    total.minutes += location.direction.minutes;

                    while (total.minutes >= 60) {
                        total.hours += 1;
                        total.minutes -= 60;
                    }
                }
            });
        });
        return total;
    }

    //儲存檔案
    const onSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser) {
            Swal.fire({
                title: '注意',
                text: `登入後才可以儲存`,
                icon: 'info',
                confirmButtonText: '好的',
                confirmButtonColor: '#5B6E60',
                customClass: {
                    confirmButton: 'custom-button',
                    title: 'text-2xl',
                    text: 'text-base'
                },
            });
            return; // 阻止提交

        } else if (!routeName.trim()) {
            Swal.fire({
                title: '錯誤',
                text: `請填寫路線名稱`,
                icon: 'error',
                confirmButtonText: '好的',
                confirmButtonColor: '#5B6E60',
                customClass: {
                    confirmButton: 'custom-button',
                    title: 'text-2xl',
                    text: 'text-base'
                },
            });
            return; // 阻止提交
        }
        else {
            setIsFullLoading(true)
            dispatch(addimgState('True'))
        }
    }

    useEffect(() => {
        const transformedData = transformDataForFirestore(addNewLocation);
        const totalData = calculateTotal(addNewLocation);

        const saveToFirebase = async () => {
            if (!addNewImg) return;

            const dataToSave = {
                auth: currentUser.uid,
                userName: currentUser.displayName,
                id: addNewPlanning.id,
                routeName: routeName,
                shareTrip: addNewPlanning.shareTrip || false,
                total: totalData,
                locations: transformedData,
                img: addNewImg
            };

            try {
                const docRef = await asyncAddData(dataToSave);
                setIsFullLoading(false)
                Swal.fire({
                    title: '成功',
                    text: `儲存成功`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    allowOutsideClick: true,
                    showConfirmButton: false
                });
                dispatch(addimg());
                dispatch(addimgState());
                dispatch(clearStateAction())
                // console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("添加文檔時出錯：", e);
            }
        };
        saveToFirebase();
    }, [addNewImg]);


    return (
        <>
            <div className='w-full mt-5 lg:w-380 lg:mr-5 lg:mt-0 flex flex-col' style={{ height: 'calc(100vh - 84px)' }}>
                <div className='bg-F5F2ED h-full p-2 rounded overflow-y-scroll scrollbar'>
                    <div className='flex mb-5 justify-between items-center'>
                        <div className='flex flex-col mb-2'>
                            <label className='co-434E4E font-medium '>路線名稱</label>
                            <input className=' h-full mr-1 mob:w-44 sm:w-80 lg:w-44' onChange={handleRouteNameChange} value={addNewPlanning.routeName}></input>
                        </div>
                        <div className='flex flex-col mb-2'>
                            <label className='co-434E4E font-medium'>開始日期</label>
                            <input
                                type='date'
                                value={addNewLocation[0].date}
                                onChange={handleDateChange}
                                className=''
                            ></input>
                        </div>
                    </div>

                    <hr className='mb-2' />
                    {addNewLocation.map((day, dayIndex) => {
                        let locationTime = day.time;
                        //計算日期
                        return (
                            <div key={dayIndex} className='pb-2'>

                                {day.date && (
                                    <p className='co-005264 font-bold text-center mb-2'>-- 第{dayIndex + 1}天 --  {day.date}
                                        <input
                                            className='w-32 bg-F5F2ED px-1'
                                            type='time'
                                            value={day.time}
                                            onChange={(event) => handleTimeChange(dayIndex, event)}
                                        /></p>)}
                                {dayIndex === 0 && day.locations.length === 0 && (<div className='bg-cyan-50 co-646564 rounded-lg p-4'>在地圖上點擊任一點或使用搜尋功能，即可新增地點，開始規畫行程。<br />請注意每一天需要有兩個地點，才可新增下一天。</div>)}

                                {day.locations.map((attraction, index) => {
                                    //計算景點時間
                                    // console.log(attraction)
                                    // 如果當前景點不是第一個，有 direction 就累加時間
                                    if (index > 0 && day.locations[index - 1].direction) {
                                        const prevDirection = day.locations[index - 1].direction;
                                        if (!isNaN(prevDirection.hours) && !isNaN(prevDirection.minutes)) {
                                            locationTime = addTime(locationTime, prevDirection.hours, prevDirection.minutes);
                                        }
                                    }
                                    return (<div key={`${dayIndex}-${index}`} >
                                        {/* 地點訊息 */}
                                        <div className='flex space-x-1 justify-center sm:flex sm:space-x-4'>
                                            <div className='w-8 h-8 bg-739A65 text-xl text-white flex items-center justify-center rounded '>{index + 1}</div>
                                            <p className="text-center flex items-center bg-005264 text-white rounded px-1">{locationTime}</p>
                                            <input className='w-44 sm:w-52 md:w-96 lg:w-44 bg-white rounded sm:py-1 sm:px-2' value={`${attraction.name}/${attraction.region}`} readOnly></input>
                                            <button type="button" className='w-6 p-0' onClick={handleDeleteLocation(dayIndex, index)}><img src='/delete.png' alt='delete icon' /></button>
                                        </div>

                                        {/* 路線訊息 */}
                                        {attraction.isLoading ? (
                                            <div className='text-center'>計算數據中...</div>
                                        ) : (
                                            attraction.direction ? (
                                                <div className='flex justify-center items-center my-2'>
                                                    <div className='co-646564 border-l-2 border-slate-300 ml-10 h-24 '></div>
                                                    <div className='ml-10 '>
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

                                {dayIndex == addNewLocation.length - 1 && day.locations.length >= 2 && (
                                    <div className='flex justify-end'>
                                        <button onClick={addNewDay} className='bg-5B6E60 text-white w-28 mt-4 '>新增下一天</button>
                                    </div>
                                )}

                            </div>)
                    })}
                </div>
                <div className='flex justify-between mt-3 items-center'>
                    <ExportGpx />
                    <button className=' w-32 text-white bg-507780 hover:bg-43646B shadow-md hover:shadow-xl' type="submit " onClick={onSubmit}>儲存</button>
                </div>
            </div >
            {isFullLoading && (<>
                <FullLoading />
            </>
            )}
        </>
    )
}

export default Route




