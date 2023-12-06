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

export default function Home() {

    //判斷登入
    const currentUser = useSelector(selectorCurrentUser);
    const router = useRouter();



    useEffect(() => {
        // 如果沒有用戶登入，顯示登入表單
        if (!currentUser) {
            router.push('/'); // 重定向到首頁
        }
    }, [currentUser, router]);



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