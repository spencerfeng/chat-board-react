import React, { Component } from 'react'
import { connect } from 'react-redux'
import SidebarChannels from './SidebarChannels'
import SpinnerRectangleBounce from '../UI/SpinnerRectangleBounce'
import * as actions from '../store/actions/index'
import { withRouter } from 'react-router-dom'

class ChatSidebar extends Component {

  componentDidMount() {
    this.props.onStartGetChannels(this.props.history);
  }

  render() {

    let accountName = null;
    if (this.props.auth._id) {
      accountName = (
        <React.Fragment>
          <div className="w-2 h-2 bg-green rounded-full mr-1"></div>
          <div>{this.props.auth.firstName} {this.props.auth.lastName}</div>
        </React.Fragment>
      )
    }

    let chatSidebar = (
      <div className="chat-sidebar-container w-220px bg-blue-darkest h-screen flex-none overflow-y-scroll relative">
        <SpinnerRectangleBounce size="normal" color="white" class="mt-100px mx-auto" show={true} />
      </div>
    )

    if (this.props.channels !== null) {
      chatSidebar = (
        <div className="chat-sidebar-container w-220px bg-blue-darkest h-screen flex-none overflow-y-scroll relative">
          <div className="chat-sidebar-section px-4 py-6 border-b border-blue-lighter">
            <h1 className="text-white text-xl mb-2">Chat Board</h1>
            <div className="text-white text-xs flex items-center">
              {accountName}
            </div>
          </div>

          <SidebarChannels channels={this.props.channels} />

          <div className="chat-sidebar-section py-6">
            <div className="text-center">
              <button onClick={() => this.props.onStartLogout(this.props.history)} type="button" className="appearance-none rounded px-3 py-2 uppercase border rounded border-white text-white text-xs hover:bg-white hover:text-blue-darkest">Logout</button>
            </div>
          </div>
        </div>
      )
    }

    return chatSidebar

  }

}

const mapStateToProps = state => {
  return {
    channels: state.channel.channels,
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onStartGetChannels: history => dispatch(actions.startGetChannels(history)),
    onStartLogout: history => dispatch(actions.startLogout(history))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatSidebar))