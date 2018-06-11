import * as actionTypes from './actionTypes'
import axios from 'axios'
import * as actions from './index'

export const startGetChannels = (history) => {
  return dispatch => {
    axios.get('/api/channels', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
    .then(response => {
      dispatch(getChannelsSuccess(response.data.data.channels))
      dispatch(actions.authSuccess(response.data.data.user._id, response.data.data.user.email, response.data.data.user.firstName, response.data.data.user.lastName, response.data.data.user.role))
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

export const getChannelsSuccess = (channels) => {
  return {
    type: actionTypes.GET_CHANNELS_SUCCESS,
    payload: {
      channels: channels
    }
  }
}

export const startAddChannel = (channelName, history, socket) => {
  return dispatch => {

    // Show loader
    dispatch(actions.displayLoader())

    return axios.post('/api/channels', {
      name: channelName
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        dispatch(addChannelSuccess(response.data.data.channel));
        history.replace(`/messages/${response.data.data.channel._id}`)

        // Tell the server that a new channel was added via socket.io
        socket.emit('new-channel-added', response.data.data.channel)

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

export const addChannelSuccess = (channel) => {
  return {
    type: actionTypes.ADD_CHANNEL_SUCCESS,
    payload: {
      channel: channel
    }
  }
}

export const startDeleteChannel = (channelId, history, socket) => {
  return (dispatch, getState) => {
    // Display loader
    dispatch(actions.displayLoader())

    axios.delete(`/api/channels/${channelId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        if (getState().channel.selectedChannelId === channelId) {
          history.replace('/messages')
          dispatch(setSelectedChannel(null))
        }
        dispatch(deleteChannelSuccess(channelId))
        dispatch(deleteChannelMessagesSuccess(channelId))

        // Tell the server that a channel was deleted via socket.io
        socket.emit('channel-deleted', channelId)

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

export const deleteChannelSuccess = channelId => {
  return {
    type: actionTypes.DELETE_CHANNEL_SUCCESS,
    payload: {
      channelId: channelId
    }
  }
}

export const deleteChannelMessagesSuccess = channelId => {
  return {
    type: actionTypes.DELETE_CHANNEL_MESSAGES_SUCCESS,
    payload: {
      channelId: channelId
    }
  }
}

export const receivedChannelDeletedBroadcast = (channelId, history) => {
  return (dispatch, getState) => {
    dispatch(deleteChannelSuccess(channelId));
    dispatch(deleteChannelMessagesSuccess(channelId));
    if (getState().channel.selectedChannelId === channelId) {
      history.replace('/messages')
      dispatch(setSelectedChannel(null))
    }
  }
}

export const setSelectedChannel = channelId => {
  return {
    type: actionTypes.SET_SELECTED_CHANNEL,
    payload: {
      channelId: channelId
    }
  }
}

export const startJoinChannel = (channelId, history, socket) => {
  return (dispatch, getState) => {
    // Display loader
    dispatch(actions.displayLoader());

    return axios.post(`/api/channels/${channelId}/members`, {
      newMemberUserId: getState().auth._id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        dispatch(joinChannelSuccess(channelId, getState().auth._id));
        dispatch(actions.addMessageSuccess(response.data.data.newMessage))

        // Tell the server that a user joined a channel via socket.io
        socket.emit('joined-channel', {
          channelId: channelId,
          userId: getState().auth._id
        });
        
        // Tell the server that a new message was added via socket.io
        socket.emit('new-message-added', response.data.data.newMessage)
        
        // Redirect to the messages list of this channel
        history.push(`/messages/${channelId}`)

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

export const joinChannelSuccess = (channelId, userId) => {
  return {
    type: actionTypes.JOIN_CHANNEL_SUCCESS,
    payload: {
      channelId: channelId,
      userId: userId
    }
  }
}

export const receivedJoinedChannelBroadcast = (channelId, userId) => {
  return (dispatch, getState) => {
    if (userId === getState().auth._id) {
      dispatch(joinChannelSuccess(channelId, userId))
    }
  }
}

export const startLeaveChannel = (channelId, history, socket) => {
  return (dispatch, getState) => {
    // Display loader
    dispatch(actions.displayLoader())

    axios.delete(`/api/channels/${channelId}/members/${getState().auth._id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-board-react-token')}`
      }
    })
      .then(response => {
        history.replace('/messages')

        dispatch(setSelectedChannel(null))

        dispatch(leaveChannelSuccess(channelId, getState().auth._id))
        dispatch(deleteChannelMessagesSuccess(channelId))

        // Tell the server that a user left a channel via socket.io
        socket.emit('left-channel', {
          channelId: channelId,
          userId: getState().auth._id
        })

        // Tell the server that a new message was added via socket.io
        socket.emit('new-message-added', response.data.data.newMessage)

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

export const leaveChannelSuccess = (channelId, userId) => {
  return {
    type: actionTypes.LEAVE_CHANNEL_SUCCESS,
    payload: {
      channelId: channelId,
      userId: userId
    }
  }
}

export const receivedLeftChannelBroadcast = (channelId, userId, history) => {
  return (dispatch, getState) => {
    if (userId === getState().auth._id) {
      if (getState().channel.selectedChannelId === channelId) {
        history.replace('/messages')
        dispatch(setSelectedChannel(null))
      }

      dispatch(leaveChannelSuccess(channelId, userId))
      dispatch(deleteChannelMessagesSuccess(channelId))
    }
  }
}

export const clearChannelsAfterLogout = () => {
  return {
    type: actionTypes.CLEAR_CHANNELS_AFTER_LOGOUT
  }
}

