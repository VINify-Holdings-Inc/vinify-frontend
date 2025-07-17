import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

import './Select.scss';

class Select extends Component {
  //State

  state = {
    options: this.props.options,
  };

  //LifeCycle Events

  componentDidMount = () => {
    if (this.props.defaultOption) {
      let arr = this.state.options;
      arr.unshift({ value: 0, text: this.props.defaultOption });
      this.setState({
        options: arr,
      });
    }
  };

  componentWillReceiveProps = (props) => {
    if (this.props.defaultOption) {
      let arr = props.options;
      arr.unshift({ value: 0, text: this.props.defaultOption });
      this.setState({
        options: arr,
      });
    } else {
      this.setState({
        options: props.options,
      });
    }
  };

  //Events

  _onChange = (event, data) => {
    let eventData = {
      target: {
        ...data,
        name: data.name,
        value: data.value,
      },
    };
    this.props.onChange(eventData);
  };

  //Render
  render() {
    return (
      <div className={`cmp-select ${this.props.isFullWidth ? 'w-full' : ''}`}>
        {this.props.label ? (
          <label htmlFor={this.props.id}>{this.props.label}</label>
        ) : null}
        <Dropdown
            style={this.props.style || {}}
          placeholder={this.props.placeholder}
          fluid={this.props.fluid}
          search={this.props.search}
          selection={this.props.selection}
          multiple={this.props.multiple}
          //   error={this.props.error}
          name={this.props.name}
          id={this.props.id}
          className={'select' + this.props.className}
          defaultValue={
            this.props.defaultValue
              ? this.props.defaultValue.toString()
              : undefined
          }
          loading={this.props.loading}
          value={
            this.props.value && !this.props.defaultValue
              ? Array.isArray(this.props.value)
                ? this.props.value
                : this.props.value.toString()
              : undefined
          }
          onChange={this._onChange}
          options={this.state.options.map((option) => {
            return {
              value: option.value.toString(),
              text: option.text,
              image: option.image ? option.image : undefined,
            };
          })}
        />
        {this.props.error ? (
          <div className="invalid-message">
            {this.props.errorComputedMessage}
          </div>
        ) : null}
        {this.props.helpText !== null ? (
          <small
            id={`${this.props.id}HelpBlock`}
            className="form-text text-muted"
          >
            {this.props.helpText}
          </small>
        ) : null}
      </div>
    );
  }
}

Select.defaultProps = {
  className: '',
  placeholder: '',
  fluid: false,
  search: false,
  selection: true,
  loading: false,
  errorComputedMessage: '',
  helpText: null,
  error: false,
  multiple: false,
  name: '',
  id: '',
};

export { Select };
