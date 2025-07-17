import React, { Component } from 'react';

import './TextBox.scss';
import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';

class TextBox extends Component {
  //State

  state = {
    css: {
      disabled: this.props.disabled ? 'disabled' : '',
      action: this.props.button ? 'action' : '',
      fluid: this.props.fluid ? 'fluid' : '',
      customStyle:this.props.customstyle? "customWidth":"",
    },
  };

  // Events

  _onChange = (ev) => {
    this.props.onChange(ev);
    
  };

  // Render

  render() {
    return (
      <div className="form-group cmp-text-box w-full">
        {this.props.showLabel ? (
          this.props.label ? (
            <label htmlFor={this.props.id}>
              {this.props.label}&nbsp;
              {this.props.dataContent ? (
                <Icon
                  icon={'info-circle'}
                  type={'solid'}
                  dataContent={this.props.dataContent}
                />
              ) : null}
            </label>
          ) : null
        ) : null}
        <div
          className={`flex ${this.state.css.fluid} ${this.state.css.disabled} ${this.state.css.action} ${this.state.css.customStyle} input`}
        >
          <input
              style={this.props.style || {}}
            min={this.props.min}
            max={this.props.max}
            readOnly={this.props.readOnly}
            type={this.props.type}
            name={this.props.id}
            value={this.props.value}
            onChange={this._onChange}
            className={`bg-light-rose rounded px-4 py-3 border border-gray-200 ${this.props.className} ${this.state.css.customStyle}`}
            id={this.props.id}
            hidden={this.props.hidden}
            placeholder={this.props.placeholder}
            required={this.props.required}
            autoComplete={this.props.autoComplete}
            aria-describedby={this.props.ariaDescribedBy}
            autoFocus={this.props.autoFocus}
            tabIndex={this.props.tabIndex ? this.props.tabIndex : '0'}
            maxLength={this.props.maxLength}
          />
          {this.props.button ?
              <button type='submit'
              className='px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3'>
              Search
              </button>
              : null}
        </div>
        {this.props.error ? (
          <div className="invalid-message">
            {this.props.errorComputedMessage}
          </div>
        ) : null}
        {this.props.helpText ? (
          <small id={`${this.props.id}HelpBlock`} className='block text-light-rose-dark'>{!this.props.error?this.props.helpText:""}</small>
        ) : null}
      </div>
    );
  }
}

TextBox.defaultProps = {
  autoComplete: undefined,
  label: undefined,
  showLabel: true,
  readOnly: false,
  className: '',
  errorComputedMessage: '',
  ariaDescribedBy: undefined,
  helpText: null,
  error: false,
  type: 'text',
  value: '',
  hidden: false,
  placeholder: '',
  required: undefined,
  autoFocus: undefined,
};

export { TextBox };
