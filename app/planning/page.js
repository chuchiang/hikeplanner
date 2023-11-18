//page.js

"use client"
import '../globals.css'
import dynamic from 'next/dynamic';
import React from 'react';
import Route from "../components/planner"
import '../globals.css'
import { store } from '../store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入


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


export default function Home() {



  return (
    // <main className="flex bg-white min-h-screen flex-col items-center justify-between p-24 ">
    // </main>
    <div className='flex justify-center'>
          <Provider store={store}>
            <Route />
            <RouteMap />
          </Provider>
    </div>
  )
}
