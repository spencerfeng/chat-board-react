import React, { Component } from 'react'
import { connect } from 'react-redux'
import Backdrop from './Backdrop'
import * as actions from '../store/actions/index'

class Modal extends Component {

  render() {

    return (
      <React.Fragment>
        <Backdrop show={this.props.show} />
        <div className="modal fixed bg-white z-50 rounded shadow-lg"
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}
        >
          <span className="absolute modal-close-btn block bg-blue-darkest text-white text-center cursor-pointer" onClick={() => this.props.onStartDimissError()}>&times;</span>
          {this.props.children}
        </div>
      </React.Fragment>
    )

  }

}

const mapDispatchToProps = dispatch => {
  return {
    onStartDimissError: () => dispatch(actions.dismissError())
  }
}

export default connect(null, mapDispatchToProps)(Modal)

