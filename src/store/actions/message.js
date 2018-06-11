import * as actionTypes from './actionTypes'
import axios from 'axios'
import * as actions from './index'

export const startGetChannelMessages = (channelId, history) => {
  return (dispatch, getState) => {
    return axios.get(`/api/messages/channels/${channelId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        dispatch(getChannelMessagesSuccess(channelId, response.data.data.messages))
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data.code === '401') {
            dispatch(actions.startLogout(history))
          } else {
            const errMsg = error.response.data.message ? error.response.data.message : error.response.data.data.title
            dispatch(actions.displayError(errMsg))
          }
        } else if (error.resquest) {
          dispatch(actions.displayError(error.request))
        } else {
          dispatch(actions.displayError(error.message))
        }
      })
  }
}

export const getChannelMessagesSuccess = (channelId, messages) => {
  return {
    type: actionTypes.GET_CHANNEL_MESSAGES_SUCCESS,
    payload: {
      channelId: channelId,
      messages: messages
    }
  }
}

export const startAddMessage = (messageBody, channelId, history, socket) => {
  return dispatch => {
    return axios.post(`/api/messages/channels/${channelId}`, {
      messageBody: messageBody
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        dispatch(addMessageSuccess(response.data.data.message))

        // Tell the server that a new message was added via socket.io
        socket.emit('new-message-added', response.data.data.message)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data.code === '401') {
            dispatch(actions.startLogout(history))
          } else {
            const errMsg = error.response.data.message ? error.response.data.message : error.response.data.data.title
            dispatch(actions.displayError(errMsg))
          }
        } else if (error.resquest) {
          dispatch(actions.displayError(error.request))
        } else {
          dispatch(actions.displayError(error.message))
        }
      })
  }
}

export const addMessageSuccess = message => {
  return {
    type: actionTypes.ADD_MESSAGE_SUCCESS,
    payload: {
      message: message
    }
  }
}

export const receivedMessageAddedBroadcast = message => {
  return (dispatch, getState) => {
    const channel = getState().channel.channels.find(c => {
      return c._id === message.channel
    });

    if (channel !== undefined) {
      if (channel.members.indexOf(getState().auth._id) >= 0) {
        if (getState().channel.selectedChannelId === message.channel) {
          dispatch(addMessageSuccess(message))
        }
      }
    }
  }
}

export const clearMessagesAfterLogout = () => {
  return {
    type: actionTypes.CLEAR_MESSAGES_AFTER_LOGOUT
  }
}

export const startDeleteMessage = (messageId, history, socket) => {
  return dispatch => {
    // Display loader
    dispatch(actions.displayLoader())

    axios.delete(`/api/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        dispatch(deleteMessageSuccess(messageId))

        // Tell the server that a message was deleted via socket.io
        socket.emit('message-deleted', messageId)

        // Hide loader
        dispatch(actions.hideLoader())
      })
      .catch(error => {
        // Hide loader
        dispatch(actions.hideLoader())

        if (error.response) {
          if (error.response.data.code === '401') {
            dispatch(actions.startLogout(history))
          } else {
            const errMsg = error.response.data.message ? error.response.data.message : error.response.data.data.title
            dispatch(actions.displayError(errMsg))
          }
        } else if (error.resquest) {
          dispatch(actions.displayError(error.request))
        } else {
          dispatch(actions.displayError(error.message))
        }
      })
  }
}

export const deleteMessageSuccess = messageId => {
  return {
    type: actionTypes.DELETE_MESSAGE_SUCCESS,
    payload: {
      messageId: messageId
    }
  }
}

export const receivedMessageDeletedBroadcast = messageId => {
  return dispatch => {
    dispatch(deleteMessageSuccess(messageId))
  }
}
