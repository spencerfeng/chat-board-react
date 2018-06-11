import React, { Component } from 'react'
import ChannelsList from './ChannelsList'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import { withRouter } from 'react-router-dom'
import SocketContext from '../socket-context'

class SidebarChannels extends Component {

  state = {
    isAddingChannel: false
  }

  newChannelTextFieldRef = React.createRef();

  toggleAddChannelForm = () => {
    this.setState(prevState => {
      return {
        isAddingChannel: !prevState.isAddingChannel
      }
    })
  }

  addChannel = e => {
    e.preventDefault();

    const channelName = this.newChannelTextFieldRef.current.value;

    this.props.onStartAddChannel(channelName, this.props.history, this.props.socket)
      .then(() => {
        // Hide the add new channel form
        this.setState({
          isAddingChannel: false
        })
      })
  }

  componentDidUpdate() {
    if (this.state.isAddingChannel) {
      this.newChannelTextFieldRef.current.focus()
    }
  }

  render() {

    let addChannelForm = null

    if (this.state.isAddingChannel) {
      addChannelForm = (
        <form className="flex items-center py-2">
          <div className="w-2/3 px-2">
            <input type="text" name="name" className="appearance-none rounded px-3 py-2 w-full text-sm" ref={this.newChannelTextFieldRef} />              
          </div>
          <div className="w-1/3 pr-2">
            <button type="submit" className="bg-green text-white rounded uppercase text-xs px-3 py-2 w-full" onClick={this.addChannel}>Create</button>
          </div>
        </form>
      );
    }

    return (
      <div className="chat-sidebar-section py-6 border-b border-blue-lighter">
        <div className="px-4 flex items-center justify-between mb-2">
          <h2 className="text-lg text-white">Channels</h2>
          <button className="text-white" onClick={this.toggleAddChannelForm}>
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
          </button>
        </div>

        {addChannelForm}    

        <ChannelsList channels={this.props.channels} />
      </div>
    )
  }

}

const SidebarChannelsWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <SidebarChannels {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const mapDispatchToProps = dispatch => {
  return {
    onStartAddChannel: (channel, history, socket) => dispatch(actions.startAddChannel(channel, history, socket))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SidebarChannelsWithSocket))