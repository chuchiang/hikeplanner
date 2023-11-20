import { createSlice } from "@reduxjs/toolkit";

export const planningSlice = createSlice({
    name: 'planning',
    initialState: {//初始
        locations: [] // 初始化 locations 為空數組
    },//初始

    reducers: {//狀態管理器，所有方法都要寫在這裡

        //增加景點
        addLocation: (state, action) => {
            console.log(state, action)
            state.locations.push(action.payload);
        },

        //增加特定index的路徑取得
        updataLocationDirection: (state, action) => {
            const { index, direction, isLoading } = action.payload; // 從action.payload 解構
            console.log(action.payload);
            if (index >= 0 && index < state.locations.length) {//檢查index 使否有效
                state.locations[index] = { ...state.locations[index], direction, isLoading }
            }
        },

        deleteLocation: (state, action) => {
            const index = action.payload;
        
            // 如果不是刪除第一個位置，則清除前一個位置的 direction
            if (index > 0 && state.locations[index - 1]) {
                state.locations[index - 1].direction = undefined;
            }
        
            // 刪除指定索引的位置
            state.locations = state.locations.filter((_, i) => i !== index);
        }

    }
});


//定義的REDUCERS可以使用ACTION匯出(具名匯出)
//會帶入REDUCER 定義的名稱
export const { addLocation, updataLocationDirection, deleteLocation } = planningSlice.actions;




export default planningSlice.reducer;