"use client"
import './globals.css'
import Head from 'next/head';
import Link from 'next/link'

function Banner() {
  return (<div className='relative w-screen overflow-hidden'style={{ height: 'calc(100vh - 44px)' }}>
    <img src='/banner.jpg' alt='mountain banner' className='h-full w-full object-cover'></img>
    <div className='flex flex-col items-center text-gray-50 absolute top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2'>
      <h2 className='text-3xl sm:text-5xl pb-3 opacity-75'>HikePlanner</h2>
      <h3 className='text-center opacity-75 font-medium text-lg sm:text-xl'>讓山徑由你設計</h3 >
      < button className='mt-8 bg-5B6E60 hover:bg-gray-400 shadow-md hover:shadow-xl text-white w-24'><Link href='/planning'>開始規劃</Link></button>
    </div>

  </div>)
}

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between   ">
      <Head>
        <title> HikePlanner</title>
        <meta name="description" content="Your exclusive hiking route planning platform" />
      </Head>
      <Banner />
      <div className='z-10  w-full items-center justify-between flex flex-col lg:flex bg-DAD1C5 pt-10 pb-20'>
        <p className='font-bold text-xl co-434E4E text-center mb-12'>讓登山之旅更輕鬆<br />由你決定每一步</p>
        <div className=' flex flex-col  items-center space-y-10  lg:space-y-12'>

          <div className='flex flex-wrap justify-center items-center  md:justify-between '>
            <div className='rounded-lg  bg-white p-2 shadow-lg '><img src='./index/routeIndex.gif' className='w-80 lg:w-96 h-full rounded-lg'></img></div>
            <div className='  rounded-lg mt-4 md:ml-8 md:mt-8 p-2 w-72 md:w-96 md:p-0 lg:ml-24'>
              <div className='flex items-center mb-6'><p className='co-5B6E60 text-xl font-bold whitespace-nowrap mr-5 '>規劃助手</p><div className='border-t-5B6E60 border w-full'></div></div>
              <p className='co-739A65 text-2xl font-bold'>個性化登山行程</p>
              <p className='co-646564 text-base'>可以根據自身體能、路線難度、時間等條件，輕鬆制定專屬路線</p>
              <div className='flex justify-end'><button className='mt-9 bg-005264 hover:opacity-75  shadow-md hover:shadow-xl text-white w-24 '><Link href='/planning'>開始規劃</Link></button></div>
            </div>
          </div>

          <div className='flex flex-wrap-reverse justify-center items-center sm:flex-nowrap lg:justify-end  md:justify-between '>
          <div className='  rounded-lg mt-4 md:mr-8 md:mt-8 w-72 p-2 md:w-96 md:p-0 lg:mr-24'>
              <div className='flex items-center mb-6'><p className='co-5B6E60 text-xl font-bold whitespace-nowrap mr-5 '>路線分析</p><div className='border-t-5B6E60 border w-full'></div></div>
              <p className='co-739A65 text-2xl font-bold'>全面掌握路線資訊</p>
              <p className='co-646564 text-base'>提供全面的路線資訊，包含爬升下降高度以及預估的行走時間</p>
              <div className='flex justify-end'><button className='mt-9 bg-005264 hover:opacity-75  shadow-md hover:shadow-xl text-white w-24 '><Link href='/planning'>路線資訊</Link></button></div>
            </div>
            <div className='rounded-lg  bg-white p-2 shadow-lg '><img src='./index/elevationIndex.gif' className='w-80 lg:w-96 h-full rounded-lg'></img></div>
          </div>

          <div className='flex flex-wrap justify-center items-center  lg:justify-between'>
            <div className='rounded-lg  bg-white p-2 shadow-lg'><img src='./index/explore.jpg' className='w-80 lg:w-96  h-full rounded-lg'></img></div>
            <div className='  rounded-lg mt-4 md:ml-8 md:mt-8 w-72 p-2 md:w-96  md:p-0 lg:ml-24' >
              <div className='flex items-center mb-6'><p className='co-5B6E60 text-xl font-bold whitespace-nowrap mr-5 '>探索景點</p><div className='border-t-5B6E60 border w-full'></div></div>
              <p className='co-739A65 text-2xl font-bold'>觀看其他人的路線</p>
              <p className='co-646564 text-base'>規劃路線可儲存與分享，他人也能使用，還可輸出照片和GPX格式</p>
              <div className='flex justify-end'><button className='mt-9 bg-005264 hover:opacity-75  shadow-md hover:shadow-xl text-white w-24 '><Link href='/planning'>探索路線</Link></button></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}