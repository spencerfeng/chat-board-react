import * as actionTypes from '../actions/actionTypes'

const initialState = {
  message: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DISPLAY_ERROR: {
      return {
        message: action.payload.message
      }
    }
    case actionTypes.DISMISS_ERROR_SUCCESS: {
      return {
        message: null
      }
    }
    default: 
      return state
  }
}

export default reducer