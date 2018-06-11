import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Chat from './components/Chat'
import Home from './components/Home'
import AuthLayout from './components/AuthLayout'
import { connect } from 'react-redux'
import * as Utilities from './utilities'
import withErrorHandler from './hoc/withErrorHandler'
import withLoader from './hoc/withLoader'
import SocketContext from './socket-context'
import * as io from 'socket.io-client'

const socket = io(process.env.REACT_APP_API_BASE_URL, {
  secure: true,
  rejectUnauthorized: false,
  path: '/chat/socket.io'
})

class App extends Component {

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <div>
          <Switch>
            <Route path="/auth" render={() => (
              Utilities.isLoggedIn() ? (
                <Redirect to='/messages' />
              ) : (
                <AuthLayout />
              )
            )} />
            <Route path="/messages" render={() => (
              !Utilities.isLoggedIn() ? (
                <Redirect to='/' />
              ) : (
                <Chat />
              )
            )} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </SocketContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(withLoader(withErrorHandler(connect(mapStateToProps)(App))))
