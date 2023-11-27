import React from'react';
import { useSelector } from 'react-redux';



const TotalDorection = ()=>{

    const directionData = useSelector((state)=>{
        return state.planning.days
    })

    const total = {
        kilmeters:0.0,
        hours:0,
        minutes:0,
        ascent:0,
        descent:0
    }

    directionData.forEach(day => {
        day.locations.forEach(location=>{
            if(location.direction){
                total.kilmeters+=parseFloat(location.direction.kilometers);
                total.ascent+=location.direction.ascent;
                total.descent+=location.direction.descent;
                total.hours+=location.direction.hours;
                total.minutes+=location.direction.minutes;

                while(total.minutes>=60){
                    total.hours+=1,
                    total.minutes-=60
                }
            }
        })
    });


    return (
        <div className='flex justify-between items-center mt-3'>
          <ul className='flex space-x-2 mb-2'>
            <li className='co-646564 text-base'>總距離：<br/>{total.kilmeters}km</li>
            <li className='border-r-2 text-base'></li>
            <li className='co-646564 text-base'>總預估時間：<br/>{total.hours}h{total.minutes}min</li>
            <li className='border-r-2'></li>
            <li className='co-646564 text-base'>總爬升高度：<br/>{total.ascent}m</li>
            <li className='border-r-2'></li>
            <li className='co-646564 text-base'>總下降高度：<br/>{total.descent}m</li>
          </ul>
          <button className='bg-5B6E60 text-white w-28  '>海拔剖面圖</button>
        </div>
    )
}

export default TotalDorection