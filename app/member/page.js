"use client"
import '../globals.css'
import React from 'react';
import '../globals.css'
import { store } from '../store';
import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';
import MyPlanner from '../components/myPlan/myPlan';
import { useRouter } from 'next/navigation';
import { auth } from "../api/firebase/firebase";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
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
          <MyPlanner />
        </div>
      </Provider>
    </main>

  )

}