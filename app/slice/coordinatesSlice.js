import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coordinates: null // 用于存储 GeoSearch 的位置数据
};

export const coordinatesSlice = createSlice({
    name: 'coordinates',
    initialState,//初始

    reducers: {//狀態管理器，所有方法都要寫在這裡

        addCoordinates: (state, action) => {
            // 直接修改狀態，不需要展開符號
            console.log(state, action)
            state.coordinates=(action.payload);
        },
        // 清空搜索位置
        clearCoordinates: (state) => {
            state.coordinates = null
        },
        
    }
});


//定義的REDUCERS可以使用ACTION匯出(具名匯出)
//會帶入REDUCER 定義的名稱
export const { addCoordinates,clearCoordinates } = coordinatesSlice.actions;




export default coordinatesSlice.reducer;