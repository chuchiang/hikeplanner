"use client" 
import './globals.css'



function Banner() {
  return (<div className='relative items-center'>
    <img src='/mountain.jpg' alt='mountain banner'></img>
    <div className='text-gray-50 absolute top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2'>
      <h2 className='text-6xl pb-3 opacity-75'>HikePlanner</h2>
      <h3 className='text-center opacity-75 font-medium text-xl'>讓山徑由你設計</h3 >
    </div>
   
  </div>)
}

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main >
      <Banner />
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
      </div>
    </main>
  )
}