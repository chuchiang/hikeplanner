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

export default function Home() {


    const currentUser = useSelector(selectorCurrentUser);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        // 如果沒有用戶登入，顯示登入表單
        if (!currentUser) {
            setShowLogin(true);
        }
    }, [currentUser]);

    if (showLogin) {
        return <LoginForm onClose={() => setShowLogin(false)} />;
    }



    return (
        // <main className="flex bg-white min-h-screen flex-col items-center justify-between p-24 ">
        // </main>
        <>
            <Provider store={store}>
                <div className='flex flex-col mt-10 items-center '>
                    <h3 className='co-646564 font-bold text-xl'>我規劃的路線</h3>
                    <MyPlanner />
                </div>

            </Provider>
        </>
    )

}