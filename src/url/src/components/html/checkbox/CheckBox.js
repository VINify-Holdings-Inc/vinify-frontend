import React, { Component } from 'react';

import './CheckBox.scss';

const CheckBox = (props) => {
  return (
    <div className="form-group mb-0" tabIndex={0}>
      <div className="ui checkbox">
        <input
          type="checkbox"
          value={props.value}
          checked={props.value}
          name={props.id}
          onChange={props.onChange}
          className="hidden"
          id={props.id}
          tabIndex={props.tabIndex ? props.tabIndex : '0'}
        />
        <label className={props.className} htmlFor={props.id}>
          {props.title}
        </label>
      </div>
    </div>
  );
};

CheckBox.defaultProps = {
  className: '',
  id: '',
  title: '',
  value: false,
};

export { CheckBox };
