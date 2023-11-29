import '../globals.css'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import {useDispatch } from 'react-redux';
import { addData } from '../slice/planningSlice'
import {asyncGetShareData} from '../api/firebase/asyncGet'

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
                        direction: location.direction ?{
                            ...location.direction,
                            path: transformPath
                        }:null

                    };
                })

            };
        });
        return {
            id:data.id,
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
        <>
            {sharePlan && sharePlan.length >0 ? (
                sharePlan.map((item, index) => {
                    const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
                    return (
                        <div key={index} className='mt-5 bg-F5F2ED  rounded-md p-5 w-800 '>

                            <h3 className='co-5B6E60 font-bold text-xl mb-4'>{item.routeName}</h3>
                            <div className='flex space-x-5 mb-2'>
                                <span className='flex'><img src='/plan/direction.png' className='w-6 m-1 co-5B6E60' /><p>距離：{item.total.kilometers}km</p></span>
                                <span className='flex'><img src='/plan/time.png' className='w-6 m-1 co-5B6E60' /><p>預估時間：{item.total.hours}h {item.total.minutes}min</p></span>
                            </div>
                            <div className='flex space-x-5'>
                                <span className='flex'><img src='/plan/trend.png' className='w-6 m-1' /><p>上升：{item.total.ascent}m</p></span>
                                <span className='flex'><img src='/plan/chart-down.png' className='w-6 m-1' /><p>下降：{item.total.descent}m</p></span>
                            </div>
                            <div className='flex justify-between items-center mt-4'>
                                <p>創作者：{item.userName}</p>
                                <p>更新時間：{readableDate}</p>
                                <div>
                                    <button className='bg-005264 text-white mr-4' onClick={() => handleUseRouteClick(item)}>規劃此路線</button>
                                </div>
                            </div>
                        </div>
                    )
                })

            ):<div className='co-005264 mt-5 font-medium'> 沒有已規劃的路線，請前往<Link href='/planning' className='hover:font-bold'>規劃助手</Link>，制定專屬路線 </div>
        }
        </>

    )
}

export default SharePlan