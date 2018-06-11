import React, { Component } from 'react'
import Backdrop from '../UI/Backdrop'
import SpinnerRectangleBounce from '../UI/SpinnerRectangleBounce'
import { connect } from 'react-redux'
import { compose } from 'redux'

const withLoader = WrappedComponent => {

  return class extends Component {

    render() {

      return (
        <React.Fragment>
          <WrappedComponent {...this.props} />
          <Backdrop show={this.props.loader.show} />
          <SpinnerRectangleBounce size="normal" color="grey" class="z-50 absolute" show={this.props.loader.show} style={{
            left: '50%',
            top: '50%',
            marginLeft: '-25px',
            marginRight: '-25px'
          }} />
        </React.Fragment>
      )

    }

  }

}

const mapStateToProps = state => {
  return {
    loader: state.loader
  }
}

const composedHoc = compose(
  connect(mapStateToProps),
  withLoader
)

export default composedHoc