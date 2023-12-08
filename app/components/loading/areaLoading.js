import '../../globals.css'
import React from "react";

function Loading() {
  return (
    <div className='flex justify-center items-center h-full'>
      <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8 border-t-4A6075" />
    </div>

  );
}

export default Loading;    // <div class="text-center z-1000">
