import React, { Component } from 'react';
import history from '../../../history';

import './ResetPassword.scss';
import { Loading } from '../../../components/shared';
import { TextBox, Button } from '../../../components/html';

import {
  ValidateResetPasswordTokenAction,
  ResetPasswordAction
} from '../../../actions/account';
import alert from '../../../core/services/alert';
import accountValidations from '../../../core/validations/accountValidations';
import formValidator from '../../../core/services/formValidator';
import Swal from 'sweetalert2';

class ResetPassword extends Component {
  // State

  state = {
    loading: false,
    isTokenValid: false,
    token: history.location.search.split('?')[1],
    resetPasswordForm: {
      password: {
        label: 'Password',
        value: '',
        required: true,
        validator: password => accountValidations.validatePassword(password),
        id: 'password',
        placeholder: '****',
        errorMessage: 'Invalid password',
        type: 'password',
        autoFocus: true,
        onChange: event => this._onChange(event),
        fluid: true
      },
      confirmPassword: {
        label: 'Confirm Password',
        value: '',
        required: true,
        validator: password =>
          password == this.state.resetPasswordForm.password.value,
        id: 'confirmPassword',
        placeholder: '****',
        errorMessage: 'Passwords do not match.',
        type: 'password',
        helpText:
          'Password must be 6-20 characters long, contains atleast one capital letter and one number',
        onChange: event => this._onChange(event),
        fluid: true
      }
    }
  };

  // LifeCycle Events

  componentDidMount = async () => {
    await this.validateResetPasswordToken();
  };

  // Events

  _onChange = event => {
    let resetPasswordForm = this.state.resetPasswordForm;
    resetPasswordForm[event.target.name].value = event.target.value;
    this.setState({
      resetPasswordForm: resetPasswordForm
    });
  };

  _onClickResetPassword = async ev => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.resetPasswordForm);
    this.setState({
      resetPasswordForm: form
    });
    if (isValid) {
      this.setState({ loading: true });
      await this.resetPassword();
    }
  };

  // Utils

  resetPassword = async () => {
    let req = {
      token: this.state.token,
      password: this.state.resetPasswordForm.password.value,
      confirmPassword: this.state.resetPasswordForm.confirmPassword.value
    };
    let response = await ResetPasswordAction(req);
    this.setState({ loading: false });
    if (response.result) {
     // alert.success('Success', 'Your password has been reset successfully');
     Swal.fire({
      title: "Reset Password",
      text: `Your password has been reset successfully`,
      icon: "Success"
    });
      history.replace('/signin');
    } else {
    //  alert.error('Failed', 'Failed to reset your password, please try again');
      Swal.fire({
        title: "Reset Password",
        text: `Failed to reset your password, please try again`,
        icon: "warning"
      });
    }
  };

  validateResetPasswordToken = async () => {
    let response = await ValidateResetPasswordTokenAction(this.state.token);
    if (response.result) {
      this.setState({
        isTokenValid: true
      });
    } else {
      history.replace('/signin');
    }
  };

  // Render

  render() {
    return this.state.isTokenValid ? (
      <div className='page-reset-password'>
        <div className='ui grid'>
          <div className='row'>
            <div className='centered eight wide computer twelve wide tablet sixteen wide mobile column'>
              <div className='form'>
                <div className='ui grid'>
                  <div className='centered seven wide computer seven wide tablet ten wide mobile column'>
                    <div className='logo'>
                      <img
                        src={require(`../../../content/img/brand/logo.png`)}
                        width='170'
                        id='logo'
                        alt='EyeMail Inc.'
                        title='EyeMail Inc.'
                      />
                    </div>
                  </div>
                </div>
                <div className='head'>
                  <h3>Reset Password</h3>
                </div>
                <form onSubmit={this._onClickResetPassword}>
                  <TextBox {...this.state.resetPasswordForm.password} />
                  <TextBox {...this.state.resetPasswordForm.confirmPassword} />
                  <div className='ui grid'>
                    <div className='centered eight wide column'>
                      <Button
                        category={'base'}
                        fluid={true}
                        type='submit'
                        title='Submit'
                      />
                    </div>
                  </div>
                  {this.state.loading ? (
                    <div className='ui center aligned grid'>
                      <Loading />
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}

export { ResetPassword };
