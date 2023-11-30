//page.js

"use client"
import '../globals.css'
import dynamic from 'next/dynamic';
import React from 'react';
import Route from "../components/planning"
import '../globals.css'
import { store } from '../store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入
import ElevationChart from '../components/lineChart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectorCurrentUser } from '../slice/authSlice';
import LoginForm from '../components/login';
import RegisterForm from '../components/register'
import TotalDorection from '../components/totalDirection'
import Head from 'next/head';

const DynamicMap = dynamic(() => import('../components/baseMap'), {
  ssr: false
});


function RouteMap() {
  return (
    <>
      <div className='mt-10'>
        <DynamicMap />
        <TotalDorection />
      </div>
    </>
  )
}


export default function Home() {

  //判斷登入
  const currentUser = useSelector(selectorCurrentUser);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // 新增用於追踪登入或註冊模式的狀態

  const handleLoginClick = () => {
    setShowLogin(true);
    setIsLoginMode(true); // 點擊登入時，設置為登入模式
  };

  const handleRegisterClick = () => {
    setShowLogin(true);
    setIsLoginMode(false); // 點擊註冊時，設置為註冊模式
  };

  useEffect(() => {
    // 如果沒有用戶登入，顯示登入表單
    if (!currentUser) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [currentUser]);

  if (showLogin) {
    return (showLogin && (
      isLoginMode ?
        <LoginForm onClose={() => setShowLogin(false)} handleRegisterClick={handleRegisterClick} /> :
        <RegisterForm onClose={() => setShowLogin(false)} handleLoginClick={handleLoginClick} />
    ));
  }


  return (
    // <main className="flex bg-white min-h-screen flex-col items-center justify-between p-24 ">
    // </main>
    <>
      <Head>
        <script src="/leaflet-image.js"></script>
      </Head>
      <Provider store={store}>
        <div className='flex justify-center mb-10'>
          <Route />
          <RouteMap />
        </div>
        {/* <ElevationChart /> */}
      </Provider>
    </>
  )

}
