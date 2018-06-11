import React, { Component } from 'react'

class Backdrop extends Component {

  render() {

    return (
      this.props.show ? <div className="backdrop fixed w-full h-full pin z-40"></div> : null
    )

  }

}

export default Backdrop