import {ADD_CARDS} from "./constants"

const initialState = {
  cards: [],
}
  
export const reducerCards = (state = initialState /* Если написать (defaultState, action), то defaultState станет вторым параметром, а action — третьим (редьюсер сломается, так как Redux всегда передаёт (state, action)). */, action) => {
    switch (action.type) {
      case ADD_CARDS: 
        return {...state, cards:[...state.cards,...action.payload]}
      default: 
        return state
    }
  }