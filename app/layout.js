"use client"
import Link from 'next/link'
import './globals.css'
import RegisterForm from './components/register'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, selectorCurrentUser } from './slice/authSlice'
import { store } from './store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入
import { auth } from "./api/firebase/firebase"; // 確保這裡是正確的導入
import LoginForm from './components/login'

import LogOut from './components/logout'
import { useRouter } from 'next/navigation';

function Header({ onLoginClick, setShowLogin, setIsLoginMode }) {

  const currentUser = useSelector(selectorCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();

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

  // const handlePlanningClick = (e) => {
  //   if (!currentUser) {
  //     e.preventDefault(); // 阻止鏈接默認行為
  //     router.push('/')
  //     setShowLogin(true); // 顯示登入表單
  //     setIsLoginMode(true); // 設置為登入模式
  //   } else {
  //     router.push('/planning')
  //   }

  // };


  return (
    <main className=" bg-DAD1C5">
        <div className='mx-1 md:mx-9 flex justify-between'>
          <Link href='/'>
            <div className='flex items-center'>
              <img className='w-12' src='/logo.png' alt='logo'></img>
              <h2 className='text-2xl co-41588C'>HikePlanner</h2>
            </div>
          </Link>
          <div className='flex space-x-4 items-center'>
            <Link href='/planning' className='co-5B6E60 font-medium hover:font-bold'>開始規劃</Link>
            <Link href='/share' className='co-5B6E60 font-medium hover:font-bold'>路線列表</Link>
            {currentUser ? (
              <>
                <Link href='/member' className='co-5B6E60 font-medium hover:font-bold'>會員中心</Link>
                <LogOut />
              </>
            ) : (
              <div>
                <button className='co-5B6E60 font-medium hover:font-bold' onClick={onLoginClick}>登入與註冊</button>
              </div>
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





// 頁面標題
// export const metadata = {
//   title: 'HikePlanner',
//   description: 'Your exclusive hiking route planning platform',
// }