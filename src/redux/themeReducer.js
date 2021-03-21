import { lightTheme } from '../styles/theme'
import { SWITCH_THEME } from './action'

const initialState = {
  theme: { ...lightTheme }
}

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_THEME:
      let newState = {
        ...state,
        theme: { ...state.theme, ...action.baseTheme }
      }
      return newState
    default:
      return state
  }
}

export default themeReducer