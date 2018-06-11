import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../UI/Modal'
import { compose } from 'redux'

const withErrorHandler = WrappedComponent => {
  return class extends Component {
    render() {
      return (
        <React.Fragment>
          <WrappedComponent {...this.props} />
          <Modal show={this.props.error.message}>
            <div className="leading-normal">{this.props.error.message ? this.props.error.message : null}</div>
          </Modal>
        </React.Fragment>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    error: state.error
  }
}

const composedHoc = compose(
  connect(mapStateToProps),
  withErrorHandler
)

export default composedHoc