import '../globals.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { updataLocationDirection, deleteLocation, addDay, changeDate, changeTime, addWrongLocation } from '../slice/planningSlice'
import ExportGpx from './exportGPX';



const MyPlanner = () => {



    return (
        <div className='mt-5 bg-F5F2ED  rounded-md p-5 w-800 '>
            <h3 className='co-5B6E60 font-bold text-lg mb-4'>戒茂斯上嘉明湖出向陽</h3>
            <div className='flex space-x-5 mb-2'>
                <span className='flex'><img src='/plan/direction.png' className='w-6 m-1' /><p>距離：22.km</p></span>
                <span className='flex'><img src='/plan/time.png' className='w-6 m-1' /><p>預估時間：15h20min</p></span>
            </div>
            <div className='flex space-x-5'>
                <span className='flex'><img src='/plan/trend.png' className='w-6 m-1' /><p>上升：2000m</p></span>
                <span className='flex'><img src='/plan/chart-down.png' className='w-6 m-1' /><p>下降：1000m</p></span>
            </div>
            <div className='flex justify-end mt-4'>
                <button className='bg-5B6E60 text-white right-0 '>使用此路線</button>

            </div>

        </div>
    )
}

export default MyPlanner