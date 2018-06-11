import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import * as actions from '../store/actions/index'
import SocketContext from '../socket-context'

class ChannelsList extends Component {

  joinChannel = channelId => {
    this.props.onStartJoinChannel(channelId, this.props.history, this.props.socket)
  }

  leaveChannel = channelId => {
    this.props.onStartLeaveChannel(channelId, this.props.history, this.props.socket)
  }

  deleteChannel(channelId) {
    this.props.onStartDeleteChannel(channelId, this.props.history, this.props.socket)
  }

  render() {

    let channelsList = (
      <div className="pl-4 pr-4 text-white text-xs">Sorry, there are no channels yet.</div>
    )

    if (this.props.channels !== null && this.props.channels.length) {
      channelsList = (
        <ul className="list-reset text-grey-light mb-3">
        {
          this.props.channels.map(channel => {
            let linkToChannelMessages = `/messages/${channel._id}`
  
            const linkClass = this.props.location.pathname === linkToChannelMessages ? 'py-2 bg-green relative cursor-pointer' : 'py-2 hover:bg-green relative cursor-pointer'
            
            return (
              <li className={linkClass} key={channel._id}>
                {this.props.auth.role === 'admin' && (
                    <button className="absolute text-white" style={{left: '5px', top: '50%', marginTop: '-9px'}} onClick={() => this.deleteChannel(channel._id)}>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  )
                }
                <NavLink 
                  to={linkToChannelMessages} 
                  className="block text-white no-underline pl-6 pr-4"
                >
                  <span className="mr-1">#</span>{channel.name}
                </NavLink>
                {channel.members.indexOf(this.props.auth._id) < 0 &&
                  (
                    <button className="absolute text-white text-xxs border border-white border-solid py-3px w-40px rounded" style={{right: '5px', top: '50%', marginTop: '-9px'}} onClick={() => this.joinChannel(channel._id)}>
                      Join
                    </button>
                  )
                }
                {channel.members.indexOf(this.props.auth._id) >= 0 &&
                  (
                    <button className="absolute text-white text-xxs border border-white border-solid py-3px w-40px rounded" style={{right: '5px', top: '50%', marginTop: '-9px'}} onClick={() => this.leaveChannel(channel._id, this.props.history)}>
                      Leave
                    </button>
                  )
                }
              </li>
            );
          })
        }
      </ul>
      );
    }

    return channelsList;

  }

}

const ChannelsListWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <ChannelsList {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onStartDeleteChannel: (channelId, history, socket) => dispatch(actions.startDeleteChannel(channelId, history, socket)),
    onStartJoinChannel: (channelId, history, socket) => dispatch(actions.startJoinChannel(channelId, history, socket)),
    onStartLeaveChannel: (channelId, history, socket) => dispatch(actions.startLeaveChannel(channelId, history, socket))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelsListWithSocket))