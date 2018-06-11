import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ChatSidebar from './ChatSidebar'
import ChatMain from './ChatMain'
import SocketContext from '../socket-context'
import * as actions from '../store/actions/index'

class Chat extends Component {

  componentDidMount() {
    // Listen channel added broadcast from the server via socket.io
    this.props.socket.on('new-channel-added-broadcast-from-server', channel => {
      this.props.onReceiveChannelAddedBroadcast(channel)
    })

    // Listen channel deleted broadcast from the server via socket.io
    this.props.socket.on('channel-deleted-broadcast-from-server', channelId => {
      this.props.onReceiveChannelDeletedBroadcast(channelId, this.props.history)
    })
    
    // Listen joined channel broadcast from the server via socket.io
    this.props.socket.on('joined-channel-broadcast-from-server', data => {
      this.props.onReceiveJoinedChannelBroadcast(data.channelId, data.userId)
    })
    
    // Listen left channel broadcast from the server via socket.io
    this.props.socket.on('left-channel-broadcast-from-server', data => {
      this.props.onReceiveLeftChannelBroadcast(data.channelId, data.userId, this.props.history)
    })
    
    // Listen new message added broadcast from the server via socket.io
    this.props.socket.on('new-message-added-broadcast-from-server', message => {
      this.props.onReceiveMessageAddedBroadcast(message)
    })
    
    // Listen message deleted broadcast from the server via socket.io
    this.props.socket.on('message-deleted-broadcast-from-server', messageId => {
      this.props.onReceiveMessageDeletedBroadcast(messageId)
    })
  }

  componentDidUpdate() {
    if (this.props.location.pathname === '/messages/' && this.props.selectedChannelId !== null) {
      this.props.onSetSelectedChannel(null)
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex">
          <ChatSidebar />
          <div className="chat-main-container flex-grow flex flex-col h-screen flex-no-wrap">
            <Route path="/messages/:channelId" component={ChatMain} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const ChatWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Chat {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const mapStateToProps = state => {
  return {
    selectedChannelId: state.channel.selectedChannelId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetSelectedChannel: channelId => dispatch(actions.setSelectedChannel(channelId)),
    onReceiveChannelAddedBroadcast: channel => dispatch(actions.addChannelSuccess(channel)),
    onReceiveChannelDeletedBroadcast: (channelId, history) => dispatch(actions.receivedChannelDeletedBroadcast(channelId, history)),
    onReceiveJoinedChannelBroadcast: (channelId, userId) => dispatch(actions.receivedJoinedChannelBroadcast(channelId, userId)),
    onReceiveLeftChannelBroadcast: (channelId, userId, history) => dispatch(actions.receivedLeftChannelBroadcast(channelId, userId, history)),
    onReceiveMessageAddedBroadcast: message => dispatch(actions.receivedMessageAddedBroadcast(message)),
    onReceiveMessageDeletedBroadcast: messageId => dispatch(actions.receivedMessageDeletedBroadcast(messageId))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatWithSocket))