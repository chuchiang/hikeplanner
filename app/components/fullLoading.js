import '../globals.css'
import React from "react";

function FullLoading() {
    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-1100'>
            <div className='absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-30'></div>
            <div className="border-gray-200 h-10 w-10 animate-spin rounded-full border-8 border-t-4A6075"></div>
        </div>
    );
}

export default FullLoading;    