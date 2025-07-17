import React, { Component } from 'react';

import './ForgotPassword.scss';
import { Loading } from '../../../components/shared';
import { TextBox, Button } from '../../../components/html';

import { ForgotPasswordAction } from '../../../actions/account';
import accountValidations from '../../../core/validations/accountValidations';
import formValidator from '../../../core/services/formValidator';

class ForgotPassword extends Component {
  state = {
    loading: false,
    success: false,
    failed: false,
    forgotPasswordForm: {
      email: {
        label: 'Email',
        value: '',
        required: true,
        validator: email => accountValidations.validateEmail(email),
        id: 'email',
        placeholder: 'someone@example.com',
        errorMessage: 'Invalid email',
        type: 'email',
        autoFocus: true,
        onChange: event => this._onChange(event),
        fluid: true
      }
    }
  };

  // Events

  _onChange = event => {
    let forgotPasswordForm = this.state.forgotPasswordForm;
    forgotPasswordForm[event.target.name].value = event.target.value;
    this.setState({
      forgotPasswordForm: forgotPasswordForm
    });
  };

  _onClickResetPassword = async ev => {
    ev.preventDefault();
    const { isValid, form } = formValidator(this.state.forgotPasswordForm);
    this.setState({
      forgotPasswordForm: form
    });
    if (isValid) {
      this.setState({ loading: true });
      await this.sendLink();
    }
  };

  // Utils

  sendLink = async () => {
    let response = await ForgotPasswordAction(
      this.state.forgotPasswordForm.email.value
    );
    this.setState({ loading: false });
    if (response.result) {
      this.setState({
        success: true
      });
    } else {
      this.setState({
        failed: true
      });
      setTimeout(() => {
        this.setState({
          failed: false
        });
      }, 3000);
    }
  };

  // Render

  render() {
    return (
      <div className='page-forgot-password'>
        <div className='ui grid'>
          <div className='row'>
            <div className='centered eight wide computer twelve wide tablet sixteen wide mobile column'>
              <div className='form border border-gray-200 rounded'>
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
                  <p>
                    To reset your password please provide your EyeMail account
                  </p>
                </div>
                {!this.state.success ? (
                  <form noValidate onSubmit={this._onClickResetPassword} className='pb-10'>
                    <TextBox {...this.state.forgotPasswordForm.email} className='w-full' />
                    <Button
                        type='submit'
                        fluid={true}
                        className='w-full button-primary'
                        category={'primary'}
                        title='Submit'
                    />
                    {this.state.loading ? (
                      <div className='ui center aligned grid'>
                        <Loading />
                      </div>
                    ) : null}
                    {this.state.failed ? (
                      <div className='failed-feedback pt-3'>
                        No account found associated with this email address
                      </div>
                    ) : null}
                  </form>
                ) : (
                  <div className='success-feedback pb-3'>
                    A link has been sent to your email address to reset your
                    password.
                  </div>
                )}
              </div>
              <div className='foot bg-gray-200 rounded'>
                <p className='link-sign-up'>
                  Don't have an EyeMail account? &nbsp;
                  <a className='actionButton' href='/signup'>
                    Sign up now!
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ForgotPassword };
