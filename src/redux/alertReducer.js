import { ALERT } from './action'

const initialState = {
  alertVisibility: false,
  alertType: '',
  alertMessage: '',
}

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT:
      let newState = {
        alertVisibility: action.alertVisibility,
        alertType: action.alertType,
        alertMessage: action.alertMessage
      }
      return newState
    default:
      return state
  }
}

export default alertReducer