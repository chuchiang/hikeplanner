import '../globals.css'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addData } from '../slice/planningSlice'
import { asyncGetShareData, asyncGetSearchData } from '../api/firebase/asyncGet'
import Loading from '../components/loading';
const SharePlan = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [sharePlan, setSharePlan] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const getData = await asyncGetShareData();
                console.log(getData);
                setSharePlan(getData);
            } catch (error) {
                console.error('error fetching data', error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);


    // 點擊觸發搜尋
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            setSharePlan();
            const searchDate = await asyncGetSearchData(searchTerm);
            console.log(searchDate)
            setSharePlan(searchDate);
        } catch (error) {
            console.error('error fetching data', error);
        }
        setIsLoading(false);
    }

    // 轉換時間戳
    function convertTimestampToDate(timestamp) {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000);
        }
        return null;
    }

    // 轉firebase 資料
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
            shareTrip: false,
        }
    }

    // 轉跳planning 頁面
    const handleUseRouteClick = (item) => {
        console.log(item)
        const reduxData = transformFirebaseDataToRedux(item);
        console.log(reduxData)
        dispatch(addData(reduxData))
        router.push('/planning');
    }

    // 沒有路線重新整理
    const refreshPage = () => {
        window.location.reload();
    }


    return (
        <div className='flex flex-col items-center  space-y-6 w-full'>
            <div className='relative  h-96 overflow-hidden  w-full '>
                <img src='./shareBanner.jpg' className='w-full h-full object-cover object-left'></img>
                <div className='flex justify-center items-center'>
                    <div className='absolute top-1/2 translate-y-[-50%] xl:w-1200  md:px-20 '>
                        <h3 className='text-white font-bold text-2xl opacity-95'>探索山林之美，追隨足跡</h3>
                        <p className='text-white font-medium text-lg opacity-95 mt-2'>複製地圖，重新規劃個人化路徑</p>
                        <div className='rounded border-black flex items-center bg-white mt-3 w-80'>
                            <input placeholder="請輸入路線名稱" className='rounded-xl w-11/12' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                            <button onClick={handleSearch} className='bg-DAD1C5'><img src='/search.png' className='w-6'></img></button>
                        </div>
                    </div>

                </div>
            </div>
            <div className='flex flex-wrap justify-center xl:w-1200 '>
                {isLoading ? (
                    <Loading />
                ) : (
                    sharePlan && sharePlan.length > 0 ? (
                        sharePlan.map((item, index) => {
                            const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
                            return (
                                <div key={index} className='w-80 rounded-lg shadow-md bg-F5F2ED m-5'>
                                    <button className='p-0 hover:shadow-xl' onClick={() => handleUseRouteClick(item)}>
                                        <div className='w-80 h-52 rounded-t-xl overflow-hidden'><img src={item.img} className='w-full h-full object-cover object-center rounded-t-xl'></img></div>
                                        <div className='flex flex-col px-5 py-2'>
                                            <div className='flex flex-star'>
                                                <h3 className='co-005264 font-bold text-2xl mb-4'>{item.routeName}</h3>
                                            </div>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className='  pr-8 pb-3'><div className='flex'><img src='/plan/direction.png' className='w-6 h-6 co-5B6E60 mr-2' />{item.total.kilometers}km</div></td>
                                                        <td className='  pb-3'><div className='flex'><img src='/plan/time.png' className='w-6 h-6 co-5B6E60 mr-2' /><p>{item.total.hours}h {item.total.minutes}min</p></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td className=' pb-3'><div className='flex'><img src='/plan/trend.png' className='w-6 h-6 mr-2' /><p>{item.total.ascent}m</p></div></td>
                                                        <td className=' pb-3'><div className='flex'><img src='/plan/chart-down.png' className='w-6 h-6 mr-2' /><p>{item.total.descent}m</p></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='border border-gray-500' />
                                            <div className='flex justify-between items-center mt-2'>
                                                <div className='mr-3'><div className='flex'><img src='/member.png' className='w-6 h-6 mr-2' /><p>{item.userName}</p></div></div>
                                                <div className='co-646564 text-sm'>{readableDate}</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )
                        })
                    ) : <div className='co-005264 mt-5 font-medium'>沒有此路線，<button onClick={refreshPage} className='hover:font-bold underline'>查看全部路線</button></div>)
                }
            </div>
        </div >
    )
}

export default SharePlan


