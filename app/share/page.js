"use client"
import '../globals.css'
import React from 'react';
import '../globals.css'
import { store } from '../store';
import { Provider } from 'react-redux';
import SharePlan from '../components/sharePlan/sharePlans';

export default function Home() {

    return (
        <main className=" flex flex-col items-center bg-white pb-10">
            <Provider store={store}>
                <SharePlan />
            </Provider>
        </main>
    )

}