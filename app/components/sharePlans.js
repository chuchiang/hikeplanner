import '../globals.css'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useDispatch } from 'react-redux';
import { addData } from '../slice/planningSlice'
import { asyncGetShareData } from '../api/firebase/asyncGet'

const SharePlan = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [sharePlan, setSharePlan] = useState([]);


    // useEffect 用來在元件載入後取得 Firebase 中的資料
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getData = await asyncGetShareData();
                console.log(getData);
                setSharePlan(getData);
            } catch (error) {
                console.error('error fetching data', error);
            }
        };
        fetchData();
    }, []);

    //轉換時間戳
    function convertTimestampToDate(timestamp) {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000);
        }
        return null;
    }

    //轉firebase 資料
    const transformFirebaseDataToRedux = (data) => {
        const transformedDays = data.route.map(day => {
            return {
                ...day,
                locations: day.locations.map(location => {

                    const transformPath = location.direction ?
                        location.direction.path.map(coord => [coord.lon, coord.lat, coord.ele])
                        : undefined
                    return {
                        ...location,
                        direction: location.direction ? {
                            ...location.direction,
                            path: transformPath
                        } : null

                    };
                })

            };
        });
        return {
            id: data.id,
            routeName: data.routeName,
            days: transformedDays
        }
    }

    //轉跳planning 頁面
    const handleUseRouteClick = (item) => {
        console.log(item)
        const reduxData = transformFirebaseDataToRedux(item);
        console.log(reduxData)
        dispatch(addData(reduxData))
        router.push('/planning');
    }





    return (
            <div className='flex flex-col items-center w-800 space-y-6'>
                <h3 className='co-005264 font-bold text-xl'>路線分享</h3>
                <div className='bg-e9edc9 flex rounded-xl w-full p-3 items-center'>
                    <p className='co-005264 font-bold mr-2'>請搜尋路線名稱：</p>
                    <div className='rounded-xl border-black flex items-center bg-white'>
                        <input className='rounded-xl w-600'></input><button><img src='/search.png' className='w-6'></img></button>
                    </div>
                </div>
                {sharePlan && sharePlan.length > 0 ? (
                    sharePlan.map((item, index) => {
                        const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
                        return (
                            <div key={index} className='flex'>
                                <img src={item.img} className='w-52 h-auto rounded-l-xl'></img>
                                <div className=' bg-e9edc9  rounded-r-xl p-5 w-600 relative'>
                                    <h3 className='co-005264 font-bold text-xl mb-4'>{item.routeName}</h3>
                                    <table className='flex'>
                                        <tr>
                                            <td className='flex mr-8 mb-3'><img src='/plan/direction.png' className='w-6 co-5B6E60' /><p>距離：{item.total.kilometers}km</p></td>
                                            <td className='flex mb-5'><img src='/plan/trend.png' className='w-6' /><p>上升：{item.total.ascent}m</p></td>
                                            <td className='flex'><img src='/member.png' className='w-6' />{item.userName}</td>
                                        </tr>
                                        <tr>
                                            <td className='flex mb-3'><img src='/plan/time.png' className='w-6 co-5B6E60' /><p>預估時間：{item.total.hours}h {item.total.minutes}min</p></td>
                                            <td className='flex mb-5'><img src='/plan/chart-down.png' className='w-6' /><p>下降：{item.total.descent}m</p></td>
                                            <td className='co-646564'><p>更新時間：{readableDate}</p></td>
                                        </tr>
                                    </table>
                                    <button className=' absolute right-5 bottom-5  bg-739A65 text-white hover:bg-5B6E60' onClick={() => handleUseRouteClick(item)}>規劃此路線</button>


                                </div>

                            </div>
                        )
                    })

                ) : ""}
            </div>

    )
}

export default SharePlan