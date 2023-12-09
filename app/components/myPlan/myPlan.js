import '../../globals.css'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../../slice/planningSlice'
import { asyncGetMyData } from '../../api/firebase/asyncGet'
import asyncDeleteData from '../../api/firebase/asyncDelete';
import { asyncUpdateShareTripStatus } from '../../api/firebase/asyncAdd';
import Loading from '../loading/areaLoading';
import { selectorCurrentUser } from '../../slice/authSlice';

const MyPlanner = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [myPlan, setMyPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = useSelector(selectorCurrentUser);


    // 改變分享狀態
    const toogleSwitch = async (item, index) => {
        const updatedItem = { ...item, shareTrip: !item.shareTrip };
        setMyPlan(currentPlans => {
            return currentPlans.map((plan, idx) => idx === index ? updatedItem : plan);
        });
        try {
            await asyncUpdateShareTripStatus(updatedItem.id, updatedItem.shareTrip)

        } catch (error) {
            console.error('Error updating shareTrip status', error);
        }
    }

    // useEffect 用來在元件載入後取得 Firebase 中的資料
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const getData = await asyncGetMyData();
                // console.log(getData);
                setMyPlan(getData);
            } catch (error) {
                console.error('error fetching data', error);
            }
            setIsLoading(false);
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
            days: transformedDays,
            shareTrip: data.shareTrip
        }
    }

    //轉跳planning 頁面
    const handleUseRouteClick = (item) => {
        // console.log(item)
        const reduxData = transformFirebaseDataToRedux(item);
        // console.log(reduxData)
        dispatch(addData(reduxData))
        router.push('/planning');
    }

    //刪除planning
    const handleDeleteRouteClick = async (id) => {
        try {
            await asyncDeleteData(id);
            setMyPlan(currentPlans => currentPlans.filter(plan => plan.id != id))
        } catch (error) {
            console.error('Error deleting document', error)
        }
    }



    return (
        <>

            {isLoading ? (<Loading />) : (myPlan && myPlan.length > 0 ? (
                <div className='space-y-5'>
                    <h3 className='co-646564 font-medium text-lg'>Hi {currentUser ? (currentUser.displayName) : ""}！ 您規劃的路線如下</h3>
                    {myPlan.map((item, index) => {
                        const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
                        return (
                            <div key={index}>
                                <div className=' bg-F5F2ED rounded-md p-5  '>
                                    <div className='flex justify-between flex-nowrap items-center'>
                                        <div className='flex items-center justify-center'><img src='/logo.png' className='w-10 h-10' /><h3 className='co-5B6E60 font-bold text-lg sm:text-xl'>{item.routeName}</h3></div>
                                        <div className="flex items-center justify-center ">
                                            {item.shareTrip ? <div className="mr-3 co-90a955 font-medium">分享行程</div> : <div className="mr-3 co-646564 font-medium">不分享行程</div>}
                                            <label htmlFor={`toggle-${index}`} className="flex items-center cursor-pointer">
                                                <div className="relative ">
                                                    <input
                                                        id={`toggle-${index}`}
                                                        type="checkbox"
                                                        className="sr-only "
                                                        onChange={() => { toogleSwitch(item, index) }}
                                                        checked={item.shareTrip}
                                                    />
                                                    <div className={`shadow-md hover:shadow-lg block w-14 h-8 rounded-full transition ${item.shareTrip ? 'bg-90a955' : 'bg-646564'}`}></div>
                                                    <div className={`shadow-md hover:shadow-lg dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${item.shareTrip ? 'transform translate-x-full' : ''}`}></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <table className='mt-5'>
                                        <tbody>
                                            <tr>
                                                <td className='  pr-5 pb-3'><div className='flex'><img src='/plan/direction.png' className='w-6 h-6 co-5B6E60 mr-2' />距離：{item.total.kilometers}km</div></td>
                                                <td className='  pb-3'><div className='flex'><img src='/plan/time.png' className='w-6 h-6 co-5B6E60 mr-2' /><p>預估時間：{item.total.hours}h {item.total.minutes}min</p></div></td>
                                            </tr>
                                            <tr>
                                                <td className=' pb-3'><div className='flex'><img src='/plan/trend.png' className='w-6 h-6 mr-2' /><p>上升：{item.total.ascent}m</p></div></td>
                                                <td className=' pb-3'><div className='flex'><img src='/plan/chart-down.png' className='w-6 h-6 mr-2' /><p>下降：{item.total.descent}m</p></div></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className='flex justify-end sm:justify-between items-center flex-wrap-reverse sm:flex-wrap '>
                                        <div className='co-646564 mr-2 text-xs sm:text-base '><p>更新時間：{readableDate}</p></div>
                                        <div className='flex flex-wrap mt-1'>
                                            <div className='rounded border mr-3 bg-6C8272 hover:bg-5B6E60 shadow-md hover:shadow-xl '><button className='text-white' onClick={() => handleUseRouteClick(item)}>規劃此路線</button></div>
                                            <div className='rounded border bg-997F7D hover:bg-87706F  shadow-md hover:shadow-xl '><button id={item.id} className='text-white' onClick={() => handleDeleteRouteClick(item.id)}>刪除</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}</div>
            ) : <div className='co-005264 mt-5 font-medium'> 沒有已規劃的路線，<Link href='/planning' className='hover:font-bold underline'>開始規劃你的登山路線</Link></div>)}
        </>
    )
}

export default MyPlanner

