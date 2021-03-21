import { SERVICE_COUNT } from './action'

const initialState = {
  serviceCount: 0
}

const countReducer = (state = initialState, action) => {
  switch (action.type) {    
      case SERVICE_COUNT:
      let newState = {
        serviceCount: action.newCount 
      }
      return newState
    default:
      return state
  }
}

export default countReducer