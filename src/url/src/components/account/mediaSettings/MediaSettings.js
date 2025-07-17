import React, { Component } from 'react';

import './MediaSettings.scss';

import accountValidations from '../../../core/validations/accountValidations';
import formValidator from '../../../core/services/formValidator';
import { Button, TextBox } from '../../html';
import { Loading } from '../../shared';
import { updateMedia } from '../../../actions/user';
import notification from '../../../core/services/alert';

class MediaSettings extends Component {
  //State

  state = {
    updateMediaSettingsForm: {
      width: {
        label: 'Width (px)',
        value: '',
        id: 'width',
        required: true,
        validator: value => value != '',
        placeholder: 'Width here',
        type: 'number',
        errorMessage: 'Please enter width!',
        onChange: event => this._onChange(event),
        fluid: true,
        min: 100,
        max: 3840,
        helpText: 'Minimum width required 100.',
        dataContent:
          'Any EyeMails that you create will default to this width by default'
      }
    }
  };

  // Events

  _onChange = event => {
    let updateMediaSettingsForm = this.state.updateMediaSettingsForm;
    updateMediaSettingsForm[event.target.name].value = event.target.value;
    this.setState({
      updateMediaSettingsForm: updateMediaSettingsForm
    });
  };

  _onClickUpdateMedia = async ev => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.updateMediaSettingsForm);
    this.setState({
      updateMediaSettingsForm: form
    });
    if (isValid) {
      this.setState({ loading: true });
      //   await this.updateMedia();
    }
  };

  // Utils

  updateMedia = async () => {
    // let password = {
    //   currentPassword: this.state.updateMediaSettingsForm.currentPassword.value,
    //   newPassword: this.state.updateMediaSettingsForm.newPassword.value
    // };
    // let res = await updateMedia(password);
    // this.setState({ loading: false });
    // if (res.result) {
    //   let updateMediaSettingsForm = this.state.updateMediaSettingsForm;
    //   updateMediaSettingsForm.currentPassword.value = '';
    //   updateMediaSettingsForm.newPassword.value = '';
    //   updateMediaSettingsForm.confirmPassword.value = '';
    //   this.setState({
    //     updateMediaSettingsForm: updateMediaSettingsForm
    //   });
    //   notification.success('Password updated successfully');
    // } else {
    //   notification.error(res.message);
    // }
  };

  //Render

  render() {
    return (
      <div className='cmp-media-settings'>
        <h1>Update Media Settings</h1>
        <div className='ui grid'>
          <div className='row'>
            <div className='four wide computer eight wide tablet sixteen wide mobile column'>
              <div className='form'>
                <form noValidate onSubmit={this._onClickUpdateMedia}>
                  <TextBox {...this.state.updateMediaSettingsForm.width} />
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
          </div>
        </div>
      </div>
    );
  }
}

export { MediaSettings };
