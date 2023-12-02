"use client"
import '../globals.css'
import React from 'react';
import '../globals.css'
import { store } from '../store';//剛剛的store 要引入
import { Provider } from 'react-redux';//Provider 要引入
import SharePlan from '../components/sharePlans';

export default function Home() {

    //判斷登入

    return (
        <main className="flex bg-white min-h-screen flex-col items-center justify-between p-10 ">
            <Provider store={store}>
                    <SharePlan />
               
            </Provider>
        </main>
    )

}