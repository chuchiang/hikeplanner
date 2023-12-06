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
        <main className=" bg-white min-h-screen p-5 ">
            <Provider store={store}>
                <div className='flex flex-col  space-y-5 max-w-full w-800 mx-auto'>
                    <SharePlan />
                </div>
            </Provider>
        </main>
    )

}