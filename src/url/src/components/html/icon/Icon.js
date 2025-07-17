import React from 'react';
import './Icon.scss';
import { ToolTip } from '../toolTip/ToolTip';

// Font Awesome Icon Wrapper
class Icon extends React.Component {
  //State
  state = {
    css: {
      type:
        this.props.type === 'solid'
          ? 's'
          : this.props.type === 'regular'
          ? 'r'
          : this.props.type === 'light'
          ? 'l'
          : this.props.type === 'duotone'
          ? 'd'
          : this.props.type === 'brand'
          ? 'b'
          : '',
      spin: this.props.spin ? 'fa-spin' : ''
    }
  };

  render() {
    const { props } = this;

    return (
      <span className={`cmp-icon relative ${props.className}`}>
        {props.dataContent ? <ToolTip dataContent={props.dataContent} /> : null}
        <span
          style={{ fontSize: `${props.size}rem` }}
          className={`icon fas ${this.state.css.spin} fa-${props.icon}`}
        />
      </span>
    );
  }
}

Icon.defaultProps = {
  size: 1,
  className: ''
};

export { Icon };
