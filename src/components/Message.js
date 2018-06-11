import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../store/actions/index'
import * as Utilities from '../utilities'
import SocketContext from '../socket-context'
import ChatAvatar from '../chat-avatar.jpg'

class Message extends Component {

  render() {
    return (
      <div className="message-item px-4 py-2 relative hover:bg-blue-lighter group">
        <div className="flex">
          <div className="message-sender-avatar mr-2 w-35px flex-none">
            <img src={ChatAvatar} className="rounded block w-full" alt="avatar" />
          </div>
          <div className="message-main flex-grow">
            <div className="message-header flex items-center mb-2">
              <div className="message-sender-name font-bold mr-2">{this.props.createdBy.firstName} {this.props.createdBy.lastName}</div>
              <div className="message-sent-time text-xs text-grey">{Utilities.dateObjToFormattedStr(this.props.createdAt)}</div>
            </div>
            <div className="message-body text-sm leading-normal">
              {this.props.body}
            </div>
          </div>
        </div>
        
        {(this.props.auth.role === 'admin' || this.props.auth._id === this.props.createdBy._id) && 
          (
            <div className="rounded hidden group-hover:block absolute" style={{right: '10px', top: '-10px'}}>
              <button onClick={() => this.props.onStartDeleteMessage(this.props.messageId, this.props.history, this.props.socket)} className="text-xs text-grey-dark border rounded border-grey px-2 py-2 bg-white">Delete</button>
            </div>
          )
        }
      </div>
    )
  }

}

const MessageWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Message {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onStartDeleteMessage: (messageId, history, socket) => dispatch(actions.startDeleteMessage(messageId, history, socket))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageWithSocket))