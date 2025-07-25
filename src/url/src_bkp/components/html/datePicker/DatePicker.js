import React, { Component } from 'react';
import { DateInput } from 'semantic-ui-calendar-react';

import './DatePicker.scss';

class DatePicker extends Component {
  //Events

  _onChange = (event, { name, value }) => {
    let eventData = {
      target: {
        name: name,
        value: value
      }
    };
    this.props.onChange(eventData);
  };

  render() {
    return (
      <div className='cmp-date-picker form-group'>
        {this.props.label ? (
          <label htmlFor={this.props.id}>{this.props.label}</label>
        ) : null}
        <DateInput
          name={this.props.name}
          placeholder={this.props.placeholder}
          fluid={this.props.fluid}
          value={this.props.value}
          iconPosition={this.props.iconPosition}
          onChange={this._onChange}
          id={this.props.id}
          className={this.props.className}
          dateFormat={this.props.dateFormat}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          closable={this.props.closable}
          clearable={this.props.clearable}
          disable={this.props.disable}
          closeOnMouseLeave={this.props.closeOnMouseLeave}
          hideMobileKeyboard={this.props.hideMobileKeyboard}
        />
        {this.props.error ? (
          <div className='invalid-message'>
            {this.props.errorComputedMessage}
          </div>
        ) : null}
        {this.props.helpText !== null ? (
          <small
            id={`${this.props.id}HelpBlock`}
            className='form-text text-muted'>
            {this.props.helpText}
          </small>
        ) : null}
      </div>
    );
  }
}

DatePicker.defaultProps = {
  className: '',
  placeholder: '',
  fluid: false,
  errorComputedMessage: '',
  helpText: null,
  error: false,
  name: '',
  id: '',
  iconPosition: 'right',
  dateFormat: 'DD-MM-YYYY',
  maxDate: null,
  minDate: null,
  clearable: true,
  disable: undefined,
  closeOnMouseLeave: false,
  hideMobileKeyboard: false,
  closable: true
};

export { DatePicker };
