"use client"
import '../globals.css'
import React from 'react';
import '../globals.css'
import { store } from '../store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectorCurrentUser } from '../slice/authSlice';
import LoginForm from '../components/login';
import MyPlanner from '../components/myPlan';
import { useRouter } from 'next/navigation';
import { auth } from "../api/firebase/firebase"; // 確保這裡是正確的導入


export default function Home() {

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (! user) {
            // 用戶已登入，更新 Redux store
            router.push('/'); 
          }
        });
    
        // 清理監聽器
        return () => unsubscribe();
      }, [router]);
    
    return (
        <main className=" bg-white min-h-screen p-5 ">
            <Provider store={store}>
                <div className='flex flex-col  space-y-5 max-w-full w-800 mx-auto'>
                    {/* <h3 className='co-646564 font-medium text-lg'>Hi {currentUser ? (currentUser.displayName) : ""}！ 您規劃的路線如下</h3> */}
                    <MyPlanner />
                </div>
            </Provider>
        </main>

    )

}