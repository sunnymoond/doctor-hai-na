import { REFRESH } from './action'

const initialState = {
  newServicePopupRefresh: false
}

const refreshReducer = (state = initialState, action) => {
  switch (action.type) {    
      case REFRESH:
      let newState = {
        newServicePopupRefresh: action.newRefresh 
      }
      return newState
    default:
      return state
  }
}

export default refreshReducer