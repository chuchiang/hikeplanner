import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
}


export const authSlice = createSlice({
    name: 'authSlice',
    initialState,//初始

    reducers: {

        //設置會員狀態
        setUser: (state, action) => {
            // console.log(state, action)
            state.currentUser = action.payload;
        },

        //刪除會員狀態
        clearUser: (state, action) => {
            // console.log(state, action)
            state.currentUser = null;
        },

        //刪除會員狀態
        addUserName: (state, action) => {
            if (state.currentUser) {
                // console.log(state, action)
                state.currentUser.displayName = action.payload;
            }

        }

    }

});


export const { setUser, clearUser, addUserName } = authSlice.actions;

//selectCurrentUser 選擇器，從 Redux store 中獲取當前用戶的狀態
export const selectorCurrentUser = (state) => state.authReducer.currentUser;

export default authSlice.reducer;