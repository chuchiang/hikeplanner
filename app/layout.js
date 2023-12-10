"use client"
import Link from 'next/link'
import './globals.css'
import RegisterForm from './components/member/register'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, selectorCurrentUser } from './slice/authSlice'
import { store } from './store';
import { Provider } from 'react-redux';
import { auth } from "./api/firebase/firebase";
import LoginForm from './components/member/login'

import LogOut from './components/member/logout'
import { useRouter } from 'next/navigation';

function Header({ onLoginClick, setShowLogin, setIsLoginMode }) {

  const currentUser = useSelector(selectorCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // 用戶已登入，更新 Redux store
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.reloadUserInfo.displayName
        }));
      } else {
        // 用戶未登入，清除 store 中的用戶信息
        dispatch(clearUser());
      }
    });

    // 清理監聽器
    return () => unsubscribe();
  }, [dispatch, router]);


  const menuClick = () => {
    setIsMenuOpen(false)
  }


  return (
    <main className=" bg-DAD1C5">
      <div className='mx-1 h-11  sm:mx-3 lg:mx-9 flex justify-between items-center '>
        <Link href='/'>
          <div className='flex items-center'>
            <img className='w-12' src='/logo.png' alt='logo'></img>
            <h2 className='text-2xl co-41588C'>HikePlanner</h2>
          </div>
        </Link>
        <button className="p-0  sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}> <img src='./more.png'></img>  </button>
        <div className={`z-1001 flex flex-col absolute top-11 right-0 shadow-lg bg-F5F2ED text-center sm:top-2.5 sm:space-x-3 sm:right-9 sm:shadow-none sm:bg-DAD1C5 sm:flex-row sm:items-center ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
          <Link href='/planning' className='p-2 co-5B6E60 font-medium border-b-2 hover:font-bold sm:border-0 sm:p-0' onClick={menuClick}>開始規劃</Link>
          <Link href='/share' className='p-2 co-5B6E60 font-medium border-b-2  hover:font-bold sm:border-0 sm:p-0' onClick={menuClick}>探索</Link>
          {currentUser ? (
            <>
              <Link href='/member' className='p-2 co-5B6E60 font-medium border-b-2  hover:font-bold sm:border-0 sm:p-0' onClick={menuClick}>會員中心</Link>
              <LogOut />
            </>
          ) : (
            <button className='p-2 co-5B6E60 font-medium hover:font-bold sm:p-0' onClick={onLoginClick}>登入與註冊</button>
          )}
        </div>
      </div>
    </main>)
}


export default function RootLayout({ children }) {

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


  return (
    <html lang="en">
      <head>
        <title>HikePlanner</title>
        <meta name="description" content="為台灣登山愛好者設計的免費路線規劃平台" />
      </head>
      <body>
        <Provider store={store}>
          <Header onLoginClick={handleLoginClick} setShowLogin={setShowLogin} setIsLoginMode={setIsLoginMode} />
          {children}
          {/* 登入覆蓋整個頁面*/}
          {showLogin && (
            isLoginMode ?
              <LoginForm onClose={() => setShowLogin(false)} handleRegisterClick={handleRegisterClick} /> :
              <RegisterForm onClose={() => setShowLogin(false)} handleLoginClick={handleLoginClick} />
          )}
        </Provider>

      </body>
    </html>
  )
}




