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
            <Provider store={store}>
                <div className='flex flex-col mt-10 items-center '>
                    <h3 className='co-646564 font-bold text-xl'>我規劃的路線</h3>
                    <MyPlanner />
                </div>

            </Provider>
        </>
    )

}