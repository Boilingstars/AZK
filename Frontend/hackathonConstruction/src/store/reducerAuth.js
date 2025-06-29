import {CHANGE_AUTH} from "./constants"

const initialState = {
  auth: false,
}
  
export const authReducer = (state = initialState /* Если написать (defaultState, action), то defaultState станет вторым параметром, а action — третьим (редьюсер сломается, так как Redux всегда передаёт (state, action)). */, action) => {
    switch (action.type) {
      case CHANGE_AUTH: 
        return {...state, auth:action.payload}
      default: 
        return state
    }
  }