import React, { Component } from 'react';

import './Button.scss';
import { Icon } from '../icon/Icon';
import { ToolTip } from '../toolTip/ToolTip';

class Button extends Component {
  // State

  state = {
    css: {
      transparent: this.props.transparent ? 'transparent' : '',
      category: this.props.category ? this.props.category : '',
      animated: this.props.animated ? 'animated' : '',
      labeled: this.props.label ? 'labeled' : '',
      basic: this.props.basic ? 'basic' : '',
      inverted: this.props.inverted ? 'inverted' : '',
      floated: this.props.float ? `${this.props.float} floated` : '',
      compact: this.props.compact ? 'compact' : '',
      toggle: this.props.toggle ? 'toggle' : '',
      fluid: this.props.fluid ? 'fluid' : '',
      circular: this.props.circular ? 'circular' : '',
    },
    active: false,
  };

  _onClick = (ev) => {
    this.setState((prevState) => {
      return {
        active: !prevState.active,
      };
    });
    if (this.props.link) {
      window.open(this.props.link, this.props.linkTarget);
      // window.location.href = this.props.link;
    }
    if (this.props.onClick) {
      this.props.onClick(ev);
    }
  };

  // Render

  render() {
    return (
      <div className={`cmp-button ${this.props.label ?  this.props.labelPosition + ' ' + this.state.css.labeled + ' button' : ''} ${ this.props.fullWidth ? 'w-full' : '' }`}
        style={{
          display: this.props.inline ? 'inline-block' : 'block',
          marginRight: this.props.inline ? '10px' : '',
          ...this.props.style || {}
        }}
        role="button"
        tabIndex="0"
      >
        {this.props.dataContent ? (
          <ToolTip dataContent={this.props.dataContent} position={'top'} />
        ) : null}
        <button
         tabIndex={0}
          data-toggle={this.props.dataToggle}
          data-target={this.props.dataTarget}
          type={this.props.type}
          disabled={this.props.disabled}
          hidden={this.props.hidden}
          onClick={this._onClick}
          aria-pressed={this.state.active}
          id={this.props.id}
          className={`${this.props.disabled ? 'disabled' : ''} ${this.state.css.toggle
            } ${this.state.css.circular}
           ${this.props.loading ? 'loading' : ''} ${this.state.css.floated} ${this.state.css.compact
            }
           ${this.props.size} ${this.props.animationType} ${this.state.css.animated
            }
           ${this.state.css.category} ${this.state.css.basic} ${this.state.css.inverted
            }
            ${this.state.css.transparent} ${this.state.css.fluid} ${this.props.className
            } 
            ${ this.props.fullWidth ? 'w-full' : '' } button`}
        >
          {this.props.iconPosition === 'left' ? (
            this.props.icon ? (
              <Icon type={this.props.iconType} icon={this.props.icon} />
            ) : null
          ) : null}
          {` ${this.props.animated ? (
              <>
                <div className="visible content">
                  {this.props.hiddenContent}
                </div>
                <div className="hidden content">
                  {this.props.visibleContent}
                </div>
              </>
            ) : (
              this.props.title
            )
            } `}
          {this.props.iconPosition === 'right' ? (
            this.props.icon ? (
              <Icon type={this.props.iconType} icon={this.props.icon} />
            ) : null
          ) : null}
        </button>
        {this.props.label ? (
          <a
            className={`ui ${this.state.css.category} ${this.props.labelStyle} basic label`}
          >
            {this.props.label}
          </a>
        ) : null}
      </div>
    );
  }
}

class ButtonGroup extends Component {
  //State

  state = {
    css: {
      floated: this.props.float ? `${this.props.float} floated` : '',
      attached: this.props.attached ? `${this.props.attached} attached` : '',
      vertical: this.props.vertical ? 'vertical' : '',
      basic: this.props.basic ? 'basic' : '',
    },
  };

  //Render
  render() {
    return (
      <div
        id={this.props.id}
        className={`cmp-button-group ui ${this.props.className} ${this.props.size} ${this.state.css.floated} ${this.props.blocks}
         ${this.props.category} ${this.state.css.basic} ${this.state.css.attached}
          ${this.state.css.vertical} buttons`}
        role="button"
        tabIndex="0"
      >
        {this.props.buttons.map((button, key) => {
          return (
            <React.Fragment key={key}>
              <Button inline={this.props.inline} {...button} />
              {this.props.conditional &&
                key !== this.props.buttons.length - 1 ? (
                <div className="or" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

Button.defaultProps = {
  id: '',
  title: '',
  type: 'button',
  className: '',
  hidden: false,
  dataToggle: '',
  dataTarget: '',
  iconPosition: 'left',
  iconType: 'solid',
  animationType: '',
  size: 'medium',
  category: '',
  linkTarget: '_self',
};

ButtonGroup.defaultProps = {
  id: '',
  className: '',
  size: 'medium',
  category: '',
  blocks: '',
};

export { Button, ButtonGroup };
