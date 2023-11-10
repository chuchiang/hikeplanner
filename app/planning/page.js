//page.js

"use client"
import '../globals.css'
import dynamic from 'next/dynamic';
import React from 'react';



const DynamicMap = dynamic(() => import('../components/baseMap'), {
  ssr: false
});

function RouteMap() {
  return (
    <>
      <div className='bg-739A65 mt-10'><DynamicMap /></div>
    </>
  )
}


function Route() {
  return (
    <div className='flex flex-col mt-10 mr-5 w-350'>
      <div className='bg-F5F2ED p-2 rounded '>
        <div className='flex mb-5 justify-center'>
          <div className='flex flex-col mb-2'>
            <label className='co-434E4E font-medium '>路線名稱</label>
            <input className='mr-2.5'></input>
          </div>
          <div className='flex flex-col mb-2'>
            <label className='co-434E4E font-medium'>開始日期</label>
            <input></input>
          </div>
        </div>
        <hr className='mb-2' />
        <div className='pb-2'>
          <p className='co-434E4E font-medium text-center mb-2'>--- 第一天 ---     2023/11/02  06：00</p>
          <div className='flex space-x-5'>
            <div className='w-7 h-7 bg-739A65 text-xl text-white flex items-center justify-center rounded-lg '>1</div>
            <input className=' w-14'></input>
            <input className='w-52'></input>
          </div>
          <div className='co-646564 border-l-2 border-slate-300 ml-3'>
            <div className='ml-9 mt-2'>
              <p>行走時間：2小時35分鐘</p>
              <p>距離：2.1 km</p>
              <p>總爬升高度：596 m</p>
              <p>總下降高度：11 m</p>
            </div>
          </div>
        </div>
        <div className='pb-2'>
          <div className='flex space-x-5'>
            <div className='w-7 h-7 bg-739A65 text-xl text-white flex items-center justify-center rounded-lg '>1</div>
            <input className=' w-14'></input>
            <input className='w-52'></input>
          </div>
          <div className='co-646564 border-l-2 border-slate-300 ml-3'>
            <div className='ml-9 mt-2'>
              <p>行走時間：2小時35分鐘</p>
              <p>距離：2.1 km</p>
              <p>總爬升高度：596 m</p>
              <p>總下降高度：11 m</p>
            </div>
          </div>
        </div>
        <div className='pb-2'>
          <p className='co-434E4E font-medium text-center mb-2'>--- 第二天 ---     2023/11/02  06：00</p>
          <div className='flex space-x-5'>
            <div className='w-7 h-7 bg-739A65 text-xl text-white flex items-center justify-center rounded-lg '>1</div>
            <input className=' w-14'></input>
            <input className='w-52'></input>
          </div>
          <div className='co-646564 border-l-2 border-slate-300 ml-3'>
            <div className='ml-9 mt-2'>
              <p>行走時間：2小時35分鐘</p>
              <p>距離：2.1 km</p>
              <p>總爬升高度：596 m</p>
              <p>總下降高度：11 m</p>
            </div>
          </div>
        </div>
        <div className='pb-2'>
          <div className='flex space-x-5'>
            <div className='w-7 h-7 bg-739A65 text-xl text-white flex items-center justify-center rounded-lg '>1</div>
            <input className=' w-14'></input>
            <input className='w-52'></input>
          </div>
        </div>
        <div className='flex justify-end'>
          <button className='bg-5B6E60 text-white w-28 '>新增下一天</button>
        </div>

      </div>
      <div className='flex justify-between mt-5'>
        <button className='bg-005264 w-32 text-white'>儲存</button>
        <button className='bg-6697A2 w-32 text-white'>匯出 GPX</button>
      </div>

    </div>
  )
}


export default function Home() {
  return (
    // <main className="flex bg-white min-h-screen flex-col items-center justify-between p-24 ">
    // </main>
    <div className='flex justify-center'>
      <Route />

      <RouteMap />
    </div>
  )
}
