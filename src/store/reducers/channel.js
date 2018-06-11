import * as actionTypes from '../actions/actionTypes'

const initialState = {
  channels: null,
  selectedChannelId: null
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.GET_CHANNELS_SUCCESS: {
      return {
        ...state,
        channels: action.payload.channels
      }
    }
    case actionTypes.ADD_CHANNEL_SUCCESS: {
      const clonedChannels = state.channels.map(channel => {
        return {
          ...channel,
          members: [...channel.members]
        }
      })
      const newChannel = {
        _id: action.payload.channel._id,
        name: action.payload.channel.name,
        createdBy: action.payload.channel.createdBy,
        createdAt: action.payload.channel.createdAt,
        members: action.payload.channel.members
      }
      return {
        ...state,
        channels: clonedChannels.concat(newChannel)
      }
    }
    case actionTypes.DELETE_CHANNEL_SUCCESS: {
      const clonedChannels = state.channels.map(channel => {
        return {
          ...channel,
          members: [...channel.members]
        }
      })
      return {
        ...state,
        channels: clonedChannels.filter(channel => {
          return channel._id !== action.payload.channelId
        })
      }
    } 
    case actionTypes.SET_SELECTED_CHANNEL: {
      let clonedChannels = null
      if (state.channels !== null) {
        clonedChannels = state.channels.map(channel => {
          return {
            ...channel,
            members: [...channel.members]
          }
        })
      }
      
      return {
        channels: clonedChannels,
        selectedChannelId: action.payload.channelId
      }
    }
    case actionTypes.JOIN_CHANNEL_SUCCESS: {
      const clonedChannels = state.channels.map(channel => {
        return {
          ...channel,
          members: channel._id === action.payload.channelId ? [...channel.members, action.payload.userId] : [...channel.members]
        }
      })
      return {
        ...state,
        channels: clonedChannels
      }
    }
    case actionTypes.LEAVE_CHANNEL_SUCCESS: {
      const clonedChannels = state.channels.map(channel => {
        return {
          ...channel,
          members: channel._id !== action.payload.channelId ? [...channel.members] : channel.members.filter(member => {
            return member !== action.payload.userId
          })
        };
      });
      return {
        ...state,
        channels: clonedChannels
      }
    }
    case actionTypes.CLEAR_CHANNELS_AFTER_LOGOUT: {
      return {
        channels: null,
        selectedChannelId: null
      }
    }
    default: 
      return state
  }
}

export default reducer