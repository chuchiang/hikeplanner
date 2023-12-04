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

const DynamicMap = dynamic(() => import('../components/baseMap'), {
  ssr: false
});


function RouteMap() {
  return (
    <>
      <div className='mt-10 relative'>
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



  useEffect(() => {
    // 如果沒有用戶登入，顯示登入表單
    if (!currentUser) {
      router.push('/'); // 重定向到首頁
    }
  }, [currentUser, router]);

  // const handleLoginClick = () => {
  //   setShowLogin(true);
  //   setIsLoginMode(true); // 點擊登入時，設置為登入模式
  // };

  // const handleRegisterClick = () => {
  //   setShowLogin(true);
  //   setIsLoginMode(false); // 點擊註冊時，設置為註冊模式
  // };
  
  // console.log(pathname);
  // // 觸發清空 Redux 狀態的 action
  // useEffect(() => {
  //   // 檢查是否離開了特定頁面
  //   if (pathname !== '/planning') {
  //     // 如果離開了特定頁面，則清空 Redux 狀態
  //     dispatch(clearStateAction())
  //   }
  // }, [pathname, dispatch])




// if (showLogin) {
//   return (showLogin && (
//     isLoginMode ?
//       <LoginForm onClose={() => setShowLogin(false)} handleRegisterClick={handleRegisterClick} /> :
//       <RegisterForm onClose={() => setShowLogin(false)} handleLoginClick={handleLoginClick} />
//   ));
// }



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
