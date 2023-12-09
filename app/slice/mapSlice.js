import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchLocation: [], // 用于存储 GeoSearch 的位置数据
};

export const geoSearchSlice = createSlice({
    name: 'geoSearch',
    initialState,//初始

    reducers: {//狀態管理器，所有方法都要寫在這裡

        geoSearchAdd: (state, action) => {
            // 直接修改狀態，不需要展開符號
            // console.log(state, action)
            state.searchLocation.push(action.payload);
        },
         // 新增一个用于设置 newLocation 的 reducer
        setSearchLocation: (state, action) => {
            // console.log(state, action)
            state.newLocation = action.payload;
        },
        // 清空搜索位置
        clearSearchLocations: (state) => {
            state.searchLocation = [];
        },
        
    }
});


//定義的REDUCERS可以使用ACTION匯出(具名匯出)
//會帶入REDUCER 定義的名稱
export const { geoSearchAdd,setSearchLocation,clearSearchLocations } = geoSearchSlice.actions;




export default geoSearchSlice.reducer;