import * as actionTypes from '../actions/actionTypes'

const initialState = {
  show: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DISPLAY_LOADER: {
      return {
        show: true
      }
    }
    case actionTypes.HIDE_LOADER: {
      return {
        show: false
      }
    }
    default: 
      return state
  }
}

export default reducer