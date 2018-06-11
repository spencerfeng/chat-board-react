import * as actionTypes from './actionTypes'

export const displayLoader = () => {
  return {
    type: actionTypes.DISPLAY_LOADER
  }
}

export const hideLoader = () => {
  return {
    type: actionTypes.HIDE_LOADER
  }
}