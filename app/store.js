


import { configureStore } from "@reduxjs/toolkit";
import planningSliceReducer from './slice/planningSlice';
import geoSearchReducer from './slice/mapSlice'
import authReducer from './slice/authSlice'
import coordinatesSliceReducer from "./slice/coordinatesSlice";

//具名匯出store
export const store = configureStore({
    reducer: {
        planning: planningSliceReducer,
        geoSearch:geoSearchReducer,
        authReducer:authReducer,
        coordinates:coordinatesSliceReducer
    },

});