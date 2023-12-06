"use client"
import '../globals.css'
import React from 'react';
import '../globals.css'
import { store } from '../store';
import { Provider } from 'react-redux';
import SharePlan from '../components/sharePlans';

export default function Home() {

    return (
        <main className=" flex flex-col items-center bg-white">
            <Provider store={store}>
                <SharePlan />
            </Provider>
        </main>
    )

}