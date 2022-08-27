import { legacy_createStore, combineReducers, applyMiddleware } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import userReducer from "./reducers";

//const rootReducer = combineReducers({userReducer});

export const Store = legacy_createStore(userReducer, applyMiddleware(thunk));