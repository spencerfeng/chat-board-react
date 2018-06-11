import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import logo from '../logo.svg'
import * as actions from '../store/actions/index'

class Home extends Component {

  componentDidMount() {
    this.props.onStartCheckAuth()
  }

  render() {

    let btns = (
      <div>
        <NavLink className="bg-green text-white px-6 py-3 rounded no-underline mx-2" to="/auth/signin">Sign In</NavLink>
        <NavLink className="bg-green text-white px-6 py-3 rounded no-underline mx-2" to="/auth/signup">Sign Up</NavLink>
      </div>
    )
  
    if (this.props.auth._id) {
      btns = (
        <div>
          <NavLink className="bg-green text-white text-2xl px-6 py-3 rounded no-underline" to="/messages">Go to Chat</NavLink>
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-5xl">Chat Board</h1>
          <img alt="chat board" className="mb-60px mt-30px" src={logo} width="200" />
          {btns}
        </div>
      </div>
    )

  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onStartCheckAuth: () => dispatch(actions.startCheckAuth())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)