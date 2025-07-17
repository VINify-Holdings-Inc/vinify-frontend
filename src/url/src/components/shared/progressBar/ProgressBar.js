import React from 'react';

import './ProgressBar.scss';

class ProgressBar extends React.Component {
  //State

  state = {
    css: {
      indicating: this.props.indicating ? 'indicating' : '',
      active: this.props.active ? 'active' : '',
      success: this.props.success ? 'success' : '',
      error: this.props.error ? 'error' : '',
      warning: this.props.warning ? 'warning' : '',
      disabled: this.props.disabled ? 'disabled' : '',
      inverted: this.props.inverted ? 'inverted' : '',
      color: this.props.color ? this.props.color : '',
      attached: this.props.attached ? `${this.props.attached} attacheds` : '',
    },
  };
  componentDidMount = ()=>{
    console.log("test",this.props);
  }
  //Render

  render() {
    return (
      <div className="cmp-progress-bar">
        <div
          className={`ui ${this.state.css.attached} ${this.state.css.active} ${this.props.size} 
          ${this.state.css.indicating} ${this.state.css.inverted} 
          ${this.state.css.success} ${this.state.css.disabled} 
          ${this.state.css.error} ${this.state.css.warning} 
          ${this.state.css.color} progress`}
          data-percent={this.props.count}
        >
          {this.props.showProgress ? (
            <div className="progress-count">{this.props.count}%</div>
          ) : null}
          <div className="bar" style={{ width: `${this.props.count}%`,marginTop:"-20px",textAlign:"center",padding:"5px",fontWeight:"bold"}}>{this.props.count}%</div>
          {this.props.label ? (
            <div className="label">{this.props.label}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

ProgressBar.defaultProps = {
  size: 'medium',
  count: 0,
  active: true,
  indicating: false,
  color: undefined,
  inverted: false,
  success: false,
  disabled: false,
  warning: false,
  error: false,
  label: undefined,
  showProgress: false,
};

export { ProgressBar };
