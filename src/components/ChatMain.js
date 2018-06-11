import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import Message from './Message'
import SpinnerRectangleBounce from '../UI/SpinnerRectangleBounce'
import SocketContext from '../socket-context'

class ChatMain extends Component {

  newMessageFieldRef = React.createRef()

  componentDidMount() {
    const channelId = this.props.match.params.channelId
    this.props.onSetSelectedChannel(channelId)

    // Only get channel messages if the current user is a member of the channel
    if (this.props.channels !== null) {
      const channel = this.props.channels.find(c => {
        return c._id === channelId
      })
      if (channel !== undefined) {
        if (channel.members.indexOf(this.props.auth._id) >=0) {
          this.props.onStartGetChannelMessages(channelId, this.props.history)
        }
      }
    }
  }

  componentDidUpdate() {
    const channelId = this.props.match.params.channelId
    if (channelId !== this.props.selectedChannelId || (channelId === this.props.selectedChannelId && this.props.error.message === null && this.props.channels && this['props']['messages'][channelId] === undefined)) {
      
      if (channelId !== this.props.selectedChannelId) {
        this.props.onSetSelectedChannel(channelId)
      }

      // Only get channel messages if the current user is a member of the channel
      if (this.props.channels !== null) {
        const channel = this.props.channels.find(c => {
          return c._id === channelId
        });
        if (channel !== undefined) {
          if (channel.members.indexOf(this.props.auth._id) >=0) {
            this.props.onStartGetChannelMessages(channelId, this.props.history)
          }
        }
      }
    }
  }

  sendMessage = e => {
    e.preventDefault()
    const messageBody = this.newMessageFieldRef.current.value

    this.props.onStartAddMessage(messageBody, this.props.match.params.channelId, this.props.history, this.props.socket)
      .then(() => {
        const messagesListContainer = document.querySelector('.chat-main-body')
        const messagesList = document.querySelector('.messages-container')

        messagesListContainer.scrollTop = messagesList.scrollHeight
      })

    // Clear message field
    this.newMessageFieldRef.current.value = ''
  }

  render() {

    const channelId = this.props.match.params.channelId
    let currentChannel = null

    // Channel Info HTML
    let channelInfo = (<SpinnerRectangleBounce size="small" color="grey" show={true} />)

    // Chat Section (including messages list and the new message text field)
    let chatSection = (
      <div className="flex flex-grow items-center justify-center">
        <SpinnerRectangleBounce color="grey" size="normal" show={true} />
      </div>
    );

    // Channels have been loaded from the server
    if (this.props.channels !== null) {
      currentChannel = this.props.channels.find(channel => {
        return channel._id === channelId
      });

      // The selected channel exists
      if (currentChannel !== undefined) {
        
        // Channel Info HTML
        channelInfo = (<h2># {currentChannel.name}</h2>)

        // Check if the current user is a member of the channel
        const isMember = currentChannel.members.indexOf(this.props.auth._id) >= 0

        // If the current user is a member 
        // and messages have been loaded from the server,
        // display the messages list
        if (isMember) {

          // Check if messages in this channel have been loaded from the server 
          const messagesLoaded = !!this['props']['messages'][channelId]
          
          let messagesList = null

          // Messages have been loaded, then display the messages and the new messge field
          if (messagesLoaded) {
            messagesList = this['props']['messages'][channelId].sort((a, b) => {
              return a.createdAt > b.createdAt
            })
            .map(message => {
              return (
                <Message createdBy={message.createdBy} createdAt={message.createdAt} body={message.body} messageId={message._id} key={message._id} />
              )
            });

            chatSection = (
              <div className="flex flex-grow flex-col">
                <div className="chat-main-body flex-grow overflow-y-scroll bg-blue-lightest">
                  <div className="messages-container">
                    <div className="messages-pane-scroller pt-4">
                      {messagesList}
                    </div>
                  </div>
                </div>
                <div className="chat-main-footer border-box flex-none h-60px px-4 bg-blue-lightest">
                  <form className="w-full flex" onSubmit={this.sendMessage}>
                    <input type="text" name="message" ref={this.newMessageFieldRef} className="appearance-none w-full rounded-lg border-2 border-grey px-4 py-3 border-box mr-4" />
                    <button type="submit" className="uppercase rounded-lg bg-green text-white text-sm px-6 py-4">Send</button>
                  </form>
                </div> 
              </div>
            );
          }
          // Messages have not been loaded, then display the spinner
          else {
            chatSection = (
              <div className="flex flex-grow items-center justify-center">
                <SpinnerRectangleBounce size="normal" color="grey" show={true} />
              </div>
            )
          }
        }
        // If the current user is not a member, display a join button
        else {
          chatSection = (
            <div className="flex flex-grow items-center justify-center">
              <button onClick={() => this.props.onStartJoinChannel(channelId, this.props.history)} className="appearance-none rounded text-xl px-6 py-3 uppercase border rounded border-black text-black text-xs hover:bg-black hover:text-white">Join</button>
            </div>
          );
        }
      }
      // The selected channel does not exist
      else {
        // TODO: what to do if the seleted channel does not exist.
      }
    }

    return (
      <React.Fragment>
        <div className="chat-main-header w-full h-60px flex flex-none items-center bg-blue-lightest px-6 text-sm border-b border-grey-light">
          {channelInfo}
        </div>
        {chatSection}
      </React.Fragment>
    )
  }
}

const ChatMainWithSocket = (props) => (
  <SocketContext.Consumer>
    {socket => <ChatMain {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const mapStateToProps = state => {
  return {
    selectedChannelId: state.channel.selectedChannelId,
    channels: state.channel.channels,
    auth: state.auth,
    messages: state.message.messages,
    error: state.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onSetSelectedChannel: (channelId) => dispatch(actions.setSelectedChannel(channelId)),
    onStartGetChannelMessages: (channelId, history) => dispatch(actions.startGetChannelMessages(channelId, history)),
    onStartAddMessage: (messageBody, channelId, history, socket) => dispatch(actions.startAddMessage(messageBody, channelId, history, socket)),
    onStartJoinChannel: (channelId, history) => dispatch(actions.startJoinChannel(channelId, history))
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMainWithSocket)