import { createSlice } from "@reduxjs/toolkit";

export const planningSlice = createSlice({
    name: 'planning',
    initialState: {//初始
        days: [
            {
                date: new Date().toISOString().split('T')[0],
                time: "08:00",
                locations: []
            }
        ]
    },

    reducers: {//狀態管理器，所有方法都要寫在這裡

        //增加景點
        addLocation: (state, action) => {
            if (state.days && state.days.length > 0) {
                console.log(state, action)

                //得到最後一天的位置並添加上去
                const last = state.days[state.days.length - 1]
                last.locations.push(action.payload)

            } else {
                console.error("No days available to add location");
            }
        },


        //增加特定index的路徑取得
        updataLocationDirection: (state, action) => {
            const { dayIndex, locationIndex, direction, isLoading } = action.payload;
            console.log(action.payload);

            if (state.days[dayIndex] && locationIndex >= 0 && locationIndex < state.days[dayIndex].locations.length) {
                // 更新特定天的特定景点的路径信息
                state.days[dayIndex].locations[locationIndex] = {
                    ...state.days[dayIndex].locations[locationIndex],
                    direction,
                    isLoading
                };
            } else {
                console.error("Invalid dayIndex or locationIndex for updating location direction");
            }
        },



        //刪除景點
        deleteLocation: (state, action) => {
            const { deleteDayIndex, deleteIndex } = action.payload;

            //檢查是不是某天最後一個
            const isLastLocationOfDay = deleteIndex === state.days[deleteDayIndex].locations.length - 1;
            //有沒有下一天
            const nextDay = deleteDayIndex < state.days.length - 1;

            //檢查是不是某天第一格
            const isFirstLocationOfDay = deleteIndex === 0;
            const hasPreviousDay = deleteDayIndex > 0;

            //檢查是不是某天第一格沒有下一格
            const hasNextLocation = state.days[deleteDayIndex].locations.length === 1
            const notFirstLocation = deleteDayIndex !== 0


            //如果是最後一格並且有下一天
            if (isLastLocationOfDay && nextDay) {
                const nextDayFirstLocation = state.days[deleteDayIndex + 1].locations[1];

                //如果下一天只有一個位置，刪除整個下一天
                if (state.days[deleteDayIndex + 1].locations.length === 1) {
                    state.days[deleteDayIndex].locations.splice(deleteIndex, 1);
                    if (state.days[deleteDayIndex].locations.length >= 1) { state.days[deleteDayIndex].locations[deleteIndex - 1].direction = undefined; }
                    state.days.splice(deleteDayIndex + 1, 1)
                } else {
                    //複製下一天第一個位置到當前天最後一個
                    state.days[deleteDayIndex].locations.splice(deleteIndex, 1);
                    state.days[deleteDayIndex + 1].locations.splice(0, 1);
                    if (state.days[deleteDayIndex].locations.length > 1) {
                        state.days[deleteDayIndex].locations[deleteIndex - 1].direction = undefined;
                    }
                    state.days[deleteDayIndex].locations.push({ ...nextDayFirstLocation });
                }
            } // 某天第一格，沒有下一個點
            else if (isFirstLocationOfDay && hasPreviousDay) {
                const previousDayLastLocationIndex = state.days[deleteDayIndex - 1].locations.length - 1;//前一天最後一格'location

                // 檢查第二天是否有多於一個景點
                if (state.days[deleteDayIndex].locations.length > 1) {
                    const nextLocation = state.days[deleteDayIndex].locations[1];
                    state.days[deleteDayIndex - 1].locations.splice(previousDayLastLocationIndex, 1); // 删除当前天的第一个位置
                    state.days[deleteDayIndex].locations.splice(0, 1); // 删除当前天的第一个位置
                    if (state.days[deleteDayIndex - 1].locations.length >= 1) {
                        state.days[deleteDayIndex - 1].locations[previousDayLastLocationIndex - 1].direction = undefined;
                    }

                    state.days[deleteDayIndex - 1].locations[previousDayLastLocationIndex] = { ...nextLocation };
                    state.days[deleteDayIndex - 1].locations[previousDayLastLocationIndex].direction = undefined;



                } // 如果當天只有一個位置，刪除整天
                else {
                    
                    state.days[deleteDayIndex - 1].locations.splice(previousDayLastLocationIndex, 1);
                    state.days[deleteDayIndex - 1].locations[previousDayLastLocationIndex - 1].direction = undefined;
                    state.days.splice(deleteDayIndex, 1);
                }
            } else {
                state.days[deleteDayIndex].locations.splice(deleteIndex, 1); // 這將會刪除指定索引的元素
                // 如果不是刪除第一個位置，則清除前一個位置的 direction
                if (deleteIndex > 0) {
                    state.days[deleteDayIndex].locations[deleteIndex - 1].direction = undefined;
                }
            }



        },

        //增加錯誤地點
        addWrongLocation: (state, action) => {
            const { addWrongLocation, wrongIndex } = action.payload;
            if (wrongIndex > 0) {
                state.days[addWrongLocation].locations[wrongIndex - 1].direction = undefined;
                state.days[addWrongLocation].locations[wrongIndex - 1].isLoading = false;
            }
            state.days[addWrongLocation].locations.splice(wrongIndex, 1);
            
        },

        //增加天數
        addDay: (state, action) => {
            const newDay = {
                date: action.payload.date, // 新天數日期
                locations: [action.payload.locations],
                time: "08:00"
            }
            state.days.push(newDay)
        },

        //日期改變
        changeDate: (state, action) => {
            const newStartDate = new Date(action.payload);

            state.days.forEach((day, index) => {
                const newDate = new Date(newStartDate)
                newDate.setDate(newDate.getDate() + index);
                day.date = newDate.toISOString().split('T')[0];
            })
        },

        //時間改變
        changeTime: (state, action) => {
            const { dayIndex, newTime } = action.payload;

            if (state.days[dayIndex]) {
                state.days[dayIndex].time = newTime
            }

        }

    }
});


//定義的REDUCERS可以使用ACTION匯出(具名匯出)
//會帶入REDUCER 定義的名稱
export const { addLocation, updataLocationDirection, deleteLocation, addDay, changeDate, changeTime, addWrongLocation } = planningSlice.actions;




export default planningSlice.reducer;