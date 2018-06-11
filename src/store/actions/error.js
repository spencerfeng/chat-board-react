import * as actionTypes from './actionTypes'

export const displayError = errMsg => {
  return {
    type: actionTypes.DISPLAY_ERROR,
    payload: {
      message: errMsg
    }
  }
}

export const dismissError = () => {
  return {
    type: actionTypes.DISMISS_ERROR_SUCCESS
  }
}