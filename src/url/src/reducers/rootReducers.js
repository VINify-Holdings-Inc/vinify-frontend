import { combineReducers } from 'redux';
import UserReducer from './userReducer';
import FlagReducer from './flagReducer';

const rootReducer = combineReducers({ UserReducer, FlagReducer });

export default rootReducer;