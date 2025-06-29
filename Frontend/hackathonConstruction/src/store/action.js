import {CHANGE_AUTH} from "./constants"
import {ADD_CARDS} from "./constants"

export const signIn = (payload) => 
  ({type: CHANGE_AUTH, payload })

export const addCards = (payload) => 
  ({type: ADD_CARDS, payload })