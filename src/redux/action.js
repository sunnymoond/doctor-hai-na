// define type
export const SWITCH_THEME = 'SWITCH_THEME'
export const SERVICE_COUNT = 'SERVICE_COUNT'
export const REFRESH = 'REFRESH'
export const ALERT = 'ALERT'

// dispatch actions
export const switchTheme = BaseTheme => {
  return dispatch => {
    dispatch({
      type: SWITCH_THEME,
      baseTheme: BaseTheme
    })
  }
}

// dispatch actions
export const updateCount = count => {
  return dispatch => {
    dispatch({
      type: SERVICE_COUNT,
      newCount: count
    })
  }
}
// dispatch actions
export const newServicePopupRefresh = refresh => {
  return dispatch => {
    dispatch({
      type: REFRESH,
      newRefresh: refresh
    })
  }
}

// dispatch actions
export const showAlert = (visibility, type, msg) => {
  return dispatch => {
    dispatch({
      type: ALERT,
      alertVisibility: visibility,
      alertType: type,
      alertMessage: msg
    })
  }
}