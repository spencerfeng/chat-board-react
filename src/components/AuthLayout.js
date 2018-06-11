import React from 'react'
import { Route, Switch, NavLink, withRouter } from 'react-router-dom'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { connect } from 'react-redux'
import logo from '../logo.svg'

const AuthLayout = props => {

  return (
    <React.Fragment>
      <div className="min-h-screen bg-blue-lightest flex flex-col">
        <header className="flex flex-none justify-between px-6 py-4 border-b text-grey-darkest items-center">
          <h1 className="text-xl flex items-center">
            <img src={logo} alt="Chat Board logo" className="mr-2 block w-30px h-auto" />
            Chat Board
          </h1>
          <ul className="list-reset flex">
            <li className="ml-4">
              <NavLink to="/auth/signin" className="text-grey-darkest no-underline">Sign In</NavLink>
            </li>
            <li className="ml-4">
              <NavLink to="/auth/signup" className="text-grey-darkest no-underline">Sign Up</NavLink>
            </li>
          </ul>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <Switch>
            <Route path="/auth/signin" component={SignIn} />
            <Route path="/auth/signup" component={SignUp} />
          </Switch>
        </div>
      </div>
    </React.Fragment>
  );

};

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
