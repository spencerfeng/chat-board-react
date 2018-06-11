import * as actionTypes from '../actions/actionTypes'

const initialState = {
  _id: null,
  firstName: '',
  lastName: '',
  email: '',
  role: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS: {
      return {
        ...state,
        _id: action.payload._id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        role: action.payload.role
      }
    }
    case actionTypes.LOGOUT_SUCCESS: {
      return {
        ...state,
        _id: null,
        firstName: '',
        lastName: '',
        email: '',
        role: ''
      }
    }
    default: 
      return state;
  }
}

export default reducer
