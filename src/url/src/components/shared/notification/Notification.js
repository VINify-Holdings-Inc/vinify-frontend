import React, { Component } from 'react';

import './Notification.scss';

import { Icon } from '../../html';

class Notification extends Component {
  //State

  state = {
    css: {
      icon:
        this.props.type === 'success'
          ? 'check-circle'
          : this.props.type === 'error'
          ? 'times-circle'
          : this.props.type === 'info'
          ? 'info-circle'
          : this.props.type === 'warning'
          ? 'exclamation-circle'
          : ''
    }
  };

  //Utils

  capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  render() {
    const { props } = this;

    return (
      <div
        id={`notification-${props.id}`}
        className={`notification ${props.type}`}>
        <span className='type'>
          <Icon icon={this.state.css.icon} className={props.type} size='1.8' />
        </span>
        <div className='body'>
          {/* <span className='title'>{this.capitalize(props.type)}</span> */}
          <span className='message'>{props.msg}</span>
        </div>
        <span className='dismiss' onClick={props.onClose}>
          <Icon icon='times' size='1.2' />
        </span>
      </div>
    );
  }
}

export { Notification };
