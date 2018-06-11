import React, { Component } from 'react'
import * as actions from '../store/actions/index'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import EmailField from '../UI/Form/EmailField'
import PasswordField from '../UI/Form/PasswordField'

class SignIn extends Component {

  mapInputs(inputs) {
    return {
      'email': inputs.email,
      'password': inputs.password
    }
  }

  signIn = model => {
    this.props.startSignIn(model.email, model.password, this.props.history)
  }

  render() {
    return (
      <div className="flex flex-col h-full justify-center w-500px px-40px py-40px border rounded">
        <h1 className="mb-8">Sign In</h1>
        <Formsy onValidSubmit={this.signIn}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block">Email</label>
            <EmailField
              name="email"
              cssClass="block appearance-none w-full rounded-lg border border-grey px-4 py-3 border-box mb-2"
              validations={{
                isEmail: true,
                isEmpty: (values, value) => {
                  if (!value) {
                    return false
                  } else {
                    return true
                  }
                }
              }}
              validationError="This is not a valid email"
              validationErrors={{
                isEmail: 'You have to use a valid email address',
                isEmpty: 'Email can not be empty'
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block">Password</label>
            <PasswordField
              name="password"
              cssClass="block appearance-none w-full rounded-lg border border-grey px-4 py-3 border-box mb-2"
              validations={{
                isEmpty: (values, value) => {
                  if (!value) {
                    return false
                  } else {
                    return true
                  }
                }
              }}
              validationError="This is not a valid password"
              validationErrors={{
                isEmpty: 'Password can not be empty'
              }}
            />
          </div>
          <div>
            <input type="submit" value="Sign In" className="btn btn-green cursor-pointer" />
          </div>
        </Formsy>
      </div>
    )
  }

}

const mapDispatchToProps = dispatch => {
  return {
    startSignIn: (email, password, history) => dispatch(actions.startSignin(email, password, history)) 
  }
}

export default connect(null, mapDispatchToProps)(SignIn)