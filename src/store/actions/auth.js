import * as actionTypes from './actionTypes'
import axios from 'axios'
import * as actions from './index'

export const startSignup = (email, password, firstName, lastName, history) => {
  return dispatch => {
    axios.post('/api/auth/signup', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    })
    .then(response => {
      // Signup success

      // Save token to local storage
      localStorage.setItem('chat-board-react-token', response.data.data.token)

      // Update redux store
      dispatch(authSuccess(response.data.data.user._id, response.data.data.user.email, response.data.data.user.firstName, response.data.data.user.lastName, response.data.data.user.role))
    
      // Redirect to messages page
      history.push('/messages')
    })
    .catch(error => {
      if (error.response) {
        const errMsg = error.response.data.message ? error.response.data.message : error.response.data.data.title
        dispatch(actions.displayError(errMsg))
      } else if (error.resquest) {
        dispatch(actions.displayError(error.request))
      } else {
        dispatch(actions.displayError(error.message))
      }
    });
  }
}

export const startSignin = (email, password, history) => {
  return dispatch => {
    axios.post('/api/auth/signin', {
      email: email,
      password: password
    })
    .then(response => {
      // Signin success

      // Save token to local storage
      localStorage.setItem('chat-board-react-token', response.data.data.token)

      // Update redux store
      dispatch(authSuccess(response.data.data.user._id, response.data.data.user.email, response.data.data.user.firstName, response.data.data.user.lastName, response.data.data.user.role))
    
      // Redirect to messages page
      history.push('/messages')
    })
    .catch(error => {
      if (error.response) {
          const errMsg = error.response.data.message ? error.response.data.message : error.response.data.data.title
          dispatch(actions.displayError(errMsg))
      } else if (error.resquest) {
        dispatch(actions.displayError(error.request))
      } else {
        dispatch(actions.displayError(error.message))
      }
    })
  }
}

export const startCheckAuth = () => {
  return dispatch => {
    axios.get('/api/auth/check', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        const user = response.data.data.user
        dispatch(authSuccess(user._id, user.email, user.firstName, user.lastName, user.role))
      })
  }
}

export const authSuccess = (userId, email, firstName, lastName, role) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      email: email,
      _id: userId,
      firstName: firstName,
      lastName: lastName,
      role: role
    }
  }
}

export const startLogout = (history) => {
  return dispatch => {
    localStorage.removeItem('chat-board-react-token')
    history.replace('/')

    dispatch(logoutSuccess())
    dispatch(actions.clearChannelsAfterLogout())
    dispatch(actions.clearMessagesAfterLogout())
  }
}

export const logoutSuccess = () => {
  return {
    type: actionTypes.LOGOUT_SUCCESS
  }
}
