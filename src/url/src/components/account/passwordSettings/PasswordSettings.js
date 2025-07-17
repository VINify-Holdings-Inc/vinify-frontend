import React, { Component } from 'react';

import './PasswordSettings.scss';

import accountValidations from '../../../core/validations/accountValidations';
import formValidator from '../../../core/services/formValidator';
import { Button, TextBox } from '../../html';
import { Loading } from '../../shared';
import { UpdatePassword } from '../../../actions/user';
import notification from '../../../core/services/alert';

class PasswordSettings extends Component {
  //State

  state = {
    updatePasswordForm: {
      currentPassword: {
        label: 'Current Password',
        value: '',
        required: true,
        validator: password => accountValidations.validatePassword(password),
        id: 'currentPassword',
        placeholder: '****',
        errorMessage: 'Invalid password',
        type: 'password',
        onChange: event => this._onChange(event),
        fluid: true
      },
      newPassword: {
        label: 'New Password',
        value: '',
        required: true,
        validator: password => {
          let errorMessage = '',
            result = true;
          if (!accountValidations.validatePassword(password)) {
            result = false;
            errorMessage = this.state.updatePasswordForm.currentPassword
              .errorMessage;
          } else if (
            password == this.state.updatePasswordForm.currentPassword.value
          ) {
            result = false;
            errorMessage =
              'Please enter a password different than the current one';
          }
          return { result, errorMessage };
        },
        id: 'newPassword',
        placeholder: '****',
        errorMessage: 'Invalid password',
        type: 'password',
        onChange: event => this._onChange(event),
        fluid: true
      },
      confirmPassword: {
        label: 'Confirm New Password',
        value: '',
        required: true,
        validator: password =>
          password == this.state.updatePasswordForm.newPassword.value,
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

  // Events

  _onChange = event => {
    let updatePasswordForm = this.state.updatePasswordForm;
    updatePasswordForm[event.target.name].value = event.target.value;
    this.setState({
      updatePasswordForm: updatePasswordForm
    });
  };

  _onClickUpdatePassword = async ev => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.updatePasswordForm);
    this.setState({
      updatePasswordForm: form
    });
    if (isValid) {
      this.setState({ loading: true });
      await this.updatePassword();
    }
  };

  // Utils

  updatePassword = async () => {
    let password = {
      currentPassword: this.state.updatePasswordForm.currentPassword.value,
      newPassword: this.state.updatePasswordForm.newPassword.value
    };
    let res = await UpdatePassword(password);
    this.setState({ loading: false });
    if (res.result) {
      let updatePasswordForm = this.state.updatePasswordForm;
      updatePasswordForm.currentPassword.value = '';
      updatePasswordForm.newPassword.value = '';
      updatePasswordForm.confirmPassword.value = '';
      this.setState({
        updatePasswordForm: updatePasswordForm
      });
      notification.success(
        'Password updated successfully',
        'passwordUpdateSuccess'
      );
    } else {
      notification.error(res.message, 'passwordUpdateFailed');
    }
  };

  //Render

  render() {
    return (
      <div className='cmp-password-settings border-t border-gray-200 mt-12'>
        <h2 className='text-xl font-bold pt-6 mb-4'>Change Password</h2>

        <div className='form lg:w-8/12 pr-8'>
          <form noValidate onSubmit={this._onClickUpdatePassword}>
            <TextBox {...this.state.updatePasswordForm.currentPassword} className='w-full' />

            <div className='flex flex-col sm:flex-row justify-between gap-x-10'>
              <TextBox {...this.state.updatePasswordForm.newPassword} className='w-full' />
              <TextBox {...this.state.updatePasswordForm.confirmPassword} className='w-full' />
            </div>

            <Button
              category={'primary'}
              type='submit'
              size={'small'}
              title='Update'
            />
            {this.state.loading ? (
              <div className='ui center aligned grid'>
                <Loading />
              </div>
            ) : null}
          </form>
        </div>
      </div>
    );
  }
}

export { PasswordSettings };
