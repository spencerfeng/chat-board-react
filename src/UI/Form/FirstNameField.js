import React, { Component } from 'react'
import { withFormsy } from 'formsy-react'

class FirstNameField extends Component {

  changeValue = e => {
    this.props.setValue(e.currentTarget.value)
  }

  render() {
    const errorMessage = this.props.getErrorMessage()

    return (
      <div>
        <input 
          type="text" 
          className={this.props.cssClass}
          onChange={this.changeValue}
          value={this.props.getValue() || ''}
        />
        { !this.props.isPristine() && (<div className="text-red text-xs">{errorMessage}</div>) }
      </div>
    )
  }

}

export default withFormsy(FirstNameField)