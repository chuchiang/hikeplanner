//page.js

"use client"
import '../globals.css'
import dynamic from 'next/dynamic';
import React from 'react';
import Route from "../components/planning"
import '../globals.css'
import { store } from '../store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectorCurrentUser } from '../slice/authSlice';
import LoginForm from '../components/login';
import RegisterForm from '../components/register'
import Head from 'next/head';
import { clearStateAction } from '../slice/planningSlice';
import { usePathname, useSearchParams } from 'next/navigation'
import ElevationChart from '../components/lineChart';
import { useRouter } from 'next/navigation';
import FullLoading from '../components/fullLoading'; // 確保路徑正確

const DynamicMap = dynamic(() => import('../components/baseMap'), {
  ssr: false,
  loading: () => <FullLoading />
});


function RouteMap() {
  return (
    <>
      <div className='mt-10 relative bg-white w-800'>
        <DynamicMap />
        <ElevationChart />
      </div>
    </>
  )
}


export default function Home() {

  //判斷登入
  const currentUser = useSelector(selectorCurrentUser);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // 新增用於追踪登入或註冊模式的狀態
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();



  
  // console.log(pathname);
  // // 觸發清空 Redux 狀態的 action
  // useEffect(() => {
  //   // 檢查是否離開了特定頁面
  //   if (pathname !== '/planning') {
  //     // 如果離開了特定頁面，則清空 Redux 狀態
  //     dispatch(clearStateAction())
  //   }
  // }, [pathname, dispatch])





return (
  // <main className="flex bg-white min-h-screen flex-col items-center justify-between p-24 ">
  // </main>
  <>
    
    <Provider store={store}>
      <div className='flex justify-center mb-10'>
        <Route />
        <RouteMap />
      </div>
    </Provider>
    
  </>
)

}
