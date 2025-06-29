import { createStore,combineReducers, applyMiddleware} from "redux"
import {thunk} from "redux-thunk";
import { authReducer } from "./reducerAuth"
import { reducerCards } from "./reducerCards"

const rootReducer = combineReducers({
  cards: reducerCards, 
  auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))