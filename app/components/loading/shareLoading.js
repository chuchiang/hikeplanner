import '../../globals.css'
import React from "react";

function ShareLoading() {
    return (
        <div className='fixed left-0 w-full h-full flex justify-center  z-1200'>
            <div className='absolute top-0 left-0 w-full h-full bg-white'></div>
            <div className="border-gray-200 h-10 w-10 animate-spin rounded-full border-8 border-t-4A6075"></div>
        </div>
    );
}

export default ShareLoading;    