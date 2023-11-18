


import { configureStore } from "@reduxjs/toolkit";
import planningSliceReducer from './slice/planningSlice';
import geoSearchReducer from './slice/mapSlice'

//具名匯出store
export const store = configureStore({
    reducer: {
        planning: planningSliceReducer,
        geoSearch:geoSearchReducer,

    },

});