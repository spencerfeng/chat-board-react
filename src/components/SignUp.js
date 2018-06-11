import React, { Component } from 'react'
import * as actions from '../store/actions/index'
import { connect } from 'react-redux'
import TextField from '../UI/Form/TextField'
import EmailField from '../UI/Form/EmailField'
import PasswordField from '../UI/Form/PasswordField'
import Formsy from 'formsy-react'

class SignUp extends Component {

  mapInputs(inputs) {
    return {
      'firstName': inputs.firstName,
      'lastName': inputs.lastName,
      'email': inputs.email,
      'password': inputs.password
    }
  }

  signUp = model => {

    this.props.startSignUp(model.email, model.password, model.firstName, model.lastName, this.props.history)
  }

  render() {

    return (
      <div className="flex flex-col h-full justify-center w-500px px-40px py-40px border rounded">
        <h1 className="mb-8">Sign Up</h1>
        <Formsy onValidSubmit={this.signUp}>
          <div className="mb-4">
            <label htmlFor="firstName" className="mb-2 block">First Name</label>
            <TextField
              name="firstName"
              cssClass="block appearance-none w-full rounded-lg border border-grey px-4 py-3 border-box mb-2"
              validations={{
                isEmpty: (values, value) => {
                  if (!value) {
                    return false
                  } else if (value.length <= 0) {
                    return false
                  } else {
                    return true
                  }
                }
              }}
              validationErrors={{
                isEmpty: 'First name can not be empty'
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="mb-2 block">First Name</label>
            <TextField
              name="lastName"
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
              validationErrors={{
                isEmpty: 'Last name can not be empty'
              }}
            />
          </div>
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
            <input type="submit" value="Sign Up" className="btn btn-green cursor-pointer" />
          </div>
        </Formsy>
      </div>
    )
  }
  
}

const mapDispatchToProps = dispatch => {
  return {
    startSignUp: (email, password, firstName, lastName, history) => dispatch(actions.startSignup(email, password, firstName, lastName, history))
  }
}

export default connect(null, mapDispatchToProps)(SignUp)