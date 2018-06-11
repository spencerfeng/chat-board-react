import React, { Component } from 'react'

class SpinnerRectangleBounce extends Component {

  state = {
    size: 'normal',
    color: 'white',
    class: ''
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      size: nextProps.size ? nextProps.size : prevState.size,
      color: nextProps.color ? nextProps.color : prevState.color,
      class: nextProps.class ? nextProps.class : prevState.class
    }
  }

  render() {
    let spinner = null;
    if (this.props.show) {
      let spinnerClass = ['spinner-rectangle-bounce', `spinner-${this.state.size}`, `spinner-${this.state.color}`, this.state.class];
      spinner = (
        <div className={spinnerClass.join(' ')} style={this.props.style}>
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      )
    }

    return spinner
  }

}

export default SpinnerRectangleBounce