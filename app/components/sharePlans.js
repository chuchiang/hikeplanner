import '../globals.css'
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../slice/planningSlice'
import { asyncGetShareData, asyncGetSearchData } from '../api/firebase/asyncGet'
import { selectorCurrentUser } from '../slice/authSlice'
import Loading from '../components/loading'; // 確保路徑正確
import Link from 'next/link';

const SharePlan = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [sharePlan, setSharePlan] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const currentUser = useSelector(selectorCurrentUser);
    const [isLoading, setIsLoading] = useState(true);


    // useEffect 用來在元件載入後取得 Firebase 中的資料
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // 開始加載數據
            try {
                const getData = await asyncGetShareData();
                console.log(getData);
                setSharePlan(getData);
            } catch (error) {
                console.error('error fetching data', error);
            }
            setIsLoading(false); // 數據加載完成
        };
        fetchData();
    }, []);

    // if (isLoading) {
    //     return <Loading />;
    // }

    //點擊觸發搜尋
    const handleSearch = async () => {
        try {
            setSharePlan();
            const searchDate = await asyncGetSearchData(searchTerm);
            console.log(searchDate)

            setSharePlan(searchDate);
        } catch (error) {
            console.error('error fetching data', error);
        }
    }

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
            shareTrip: false,
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

    // 沒有路線重新整理
    const refreshPage = () => {
        window.location.reload();
    }


    return (
        <div className='flex flex-col items-center  space-y-6 '>
            <div className='relative w-screen h-96 overflow-hidden'>
                <img src='./shareBanner.jpg' className='w-full h-full object-cover object-left'></img>
                <div className='absolute top-1/2 translate-y-[-50%] left-10 sm:left-1/3 sm:translate-x-[-70%]'>
                    <h3 className='text-white font-bold text-2xl opacity-75'>探索山林之美，追隨足跡</h3>
                    <div className='rounded border-black flex items-center bg-white mt-3'>
                        <input placeholder="請輸入路線名稱" className='rounded-xl w-11/12' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                        <button onClick={handleSearch} className='bg-F5F2ED'><img src='/search.png' className='w-6'></img></button>
                    </div>
                </div>
            </div>





            <div className='flex flex-wrap justify-center lg:w-1200 '>

                {isLoading ? (
                    <Loading />
                ) : (

                    sharePlan && sharePlan.length > 0 ? (
                        sharePlan.map((item, index) => {
                            const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
                            return (
                                <div key={index} className='w-80 rounded-lg shadow-md bg-D8EBE4 m-5'>
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



                                        {/* <img src={item.img} className=' w-52 h-auto rounded-l-xl'></img>
                                <div className=' bg-E7EDD8  rounded-r-xl p-5 flex flex-col '>
                                    <h3 className='co-005264 font-bold text-xl mb-4'>{item.routeName}</h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className='  pr-8 pb-3'><div className='flex'><img src='/plan/direction.png' className='w-6 h-6 co-5B6E60 mr-2' />距離：{item.total.kilometers}km</div></td>
                                                <td className='  pb-3'><div className='flex'><img src='/plan/time.png' className='w-6 h-6 co-5B6E60 mr-2' /><p>預估時間：{item.total.hours}h {item.total.minutes}min</p></div></td>
                                            </tr>
                                            <tr>
                                                <td className=' pb-3'><div className='flex'><img src='/plan/trend.png' className='w-6 h-6 mr-2' /><p>上升：{item.total.ascent}m</p></div></td>
                                                <td className=' pb-3'><div className='flex'><img src='/plan/chart-down.png' className='w-6 h-6 mr-2' /><p>下降：{item.total.descent}m</p></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='flex justify-between mt-2 items-center flex-wrap'>
                                        <div className='mr-3 mt-2'><div className='flex'><img src='/member.png' className='w-6 h-6 mr-2' /><p>{item.userName}</p></div></div>

                                        <div className='co-646564 mr-3 mt-2 text-sm'><p>更新時間：{readableDate}</p></div>

                                        <button className=' w-30 mt-2 bg-507780 hover:bg-43646B shadow-md hover:shadow-xl text-white hover:bg-5B6E60' onClick={() => handleUseRouteClick(item)}>規劃此路線</button>
                                    </div>
                                </div> */}
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


// return (
//     <div className='flex flex-col items-center  space-y-6'>
//         <h3 className='co-005264 font-bold text-xl'>路線分享</h3>
//         <div className='bg-E7EDD8 flex rounded-xl w-full p-3 items-center justify-center'>
//             <p className='co-005264 font-bold mr-2'>搜尋路線名稱：</p>
//             <div className='rounded-xl border-black flex items-center bg-white w-9/12'>
//                 <input className='rounded-xl w-11/12' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input><button onClick={handleSearch}><img src='/search.png' className='w-6'></img></button>
//             </div>
//         </div>
//         {isLoading ? (
//             <Loading />
//         ) : (

//             sharePlan && sharePlan.length > 0 ? (
//                 sharePlan.map((item, index) => {
//                     const readableDate = convertTimestampToDate(item.recordTime)?.toLocaleString();
//                     return (
//                         <div key={index} className='flex flex-wrap'>
//                             <img src={item.img} className=' w-52 h-auto rounded-l-xl'></img>
//                             <div className=' bg-E7EDD8  rounded-r-xl p-5 flex flex-col '>
//                                 <h3 className='co-005264 font-bold text-xl mb-4'>{item.routeName}</h3>
//                                 <table>
//                                     <tbody>
//                                         <tr>
//                                             <td className='  pr-8 pb-3'><div className='flex'><img src='/plan/direction.png' className='w-6 h-6 co-5B6E60 mr-2' />距離：{item.total.kilometers}km</div></td>
//                                             <td className='  pb-3'><div className='flex'><img src='/plan/time.png' className='w-6 h-6 co-5B6E60 mr-2' /><p>預估時間：{item.total.hours}h {item.total.minutes}min</p></div></td>
//                                         </tr>
//                                         <tr>
//                                             <td className=' pb-3'><div className='flex'><img src='/plan/trend.png' className='w-6 h-6 mr-2' /><p>上升：{item.total.ascent}m</p></div></td>
//                                             <td className=' pb-3'><div className='flex'><img src='/plan/chart-down.png' className='w-6 h-6 mr-2' /><p>下降：{item.total.descent}m</p></div></td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                                 <div className='flex justify-between mt-2 items-center flex-wrap'>
//                                     <div className='mr-3 mt-2'><div className='flex'><img src='/member.png' className='w-6 h-6 mr-2' /><p>{item.userName}</p></div></div>

//                                     <div className='co-646564 mr-3 mt-2 text-sm'><p>更新時間：{readableDate}</p></div>

//                                     <button className=' w-30 mt-2 bg-507780 hover:bg-43646B shadow-md hover:shadow-xl text-white hover:bg-5B6E60' onClick={() => handleUseRouteClick(item)}>規劃此路線</button>
//                                 </div>


//                             </div>

//                         </div>
//                     )
//                 })

//             ) : <div className='co-005264 mt-5 font-medium'>沒有此路線，<button onClick={refreshPage} className='hover:font-bold underline'>查看全部路線</button></div>)
//         }
//     </div>

// )