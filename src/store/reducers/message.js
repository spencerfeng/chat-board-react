import * as actionTypes from '../actions/actionTypes'

const initialState = {
  messages: {}
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.GET_CHANNEL_MESSAGES_SUCCESS: {
      const clonedMessages = {};
      for (let key in state.messages) {
        const clonedMessagesInAChannel = state['messages'][key].map(message => {
          return {
            ...message,
            createdBy: {...message.createdBy} 
          }
        })
        
        clonedMessages[key] = clonedMessagesInAChannel
      }

      return {
        messages: {
          ...clonedMessages,
          [action.payload.channelId]: action.payload.messages
        }
      }
    }
    case actionTypes.ADD_MESSAGE_SUCCESS: {
      const clonedMessages = {}
      for (let key in state.messages) {
        const clonedMessagesInAChannel = state['messages'][key].map(message => {
          return {
            ...message,
            createdBy: {...message.createdBy} 
          }
        })
        
        clonedMessages[key] = clonedMessagesInAChannel;

        if (key === action.payload.message.channel) {
          clonedMessages[key].push(action.payload.message);
        }
      }

      return {
        messages: clonedMessages
      }
    }
    case actionTypes.DELETE_CHANNEL_MESSAGES_SUCCESS: {
      const clonedMessages = {};
      for (let key in state.messages) {
        const clonedMessagesInAChannel = state['messages'][key].map(message => {
          return {
            ...message,
            createdBy: {...message.createdBy} 
          }
        })
        
        clonedMessages[key] = clonedMessagesInAChannel;
      }

      delete clonedMessages[action.payload.channelId];

      return {
        messages: clonedMessages
      }
    }
    case actionTypes.CLEAR_MESSAGES_AFTER_LOGOUT: {
      return {
        messages: {}
      }
    }
    case actionTypes.DELETE_MESSAGE_SUCCESS: {
      const clonedMessages = {};
      for (let key in state.messages) {
        const clonedMessagesInAChannel = state['messages'][key].map(message => {
          return {
            ...message,
            createdBy: {...message.createdBy} 
          }
        })

        const filterdClonedMessagesInAChannel = clonedMessagesInAChannel.filter(message => {
          return message._id.toString() !== action.payload.messageId
        })
        
        clonedMessages[key] = filterdClonedMessagesInAChannel
      }

      return {
        messages: clonedMessages
      }
    }
    default: 
      return state
  }
}

export default reducer