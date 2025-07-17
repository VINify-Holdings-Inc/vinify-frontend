import React, { Component } from 'react';
import { TextArea as SemanticTextArea, Form } from 'semantic-ui-react';

import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';

import './TextArea.scss';

class TextArea extends Component {
    //State

    state = {
        css: {
            disabled: this.props.disabled ? 'disabled' : '',
            action: this.props.button ? 'action' : '',
            fluid: this.props.fluid ? 'fluid' : '',
        },
    };

    // Events

    _onChange = (ev) => {
        this.props.onChange(ev);
    };

    render() {
        return (
            <div className="form-group cmp-text-area">
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
                    className={`ui ${this.state.css.fluid} ${this.state.css.disabled} ${this.state.css.action}`}
                >
                    <textarea
                        readOnly={this.props.readOnly}
                        name={this.props.id}
                        value={this.props.value}
                        onChange={this._onChange}
                        className={`form-control bg-light-rose ${this.props.className}`}
                        id={this.props.id}
                        hidden={this.props.hidden}
                        placeholder={this.props.placeholder}
                        required={this.props.required}
                        autoComplete={this.props.autoComplete}
                        aria-describedby={this.props.ariaDescribedBy}
                        autoFocus={this.props.autoFocus}
                        rows='5'
                        tabIndex={this.props.tabIndex ? this.props.tabIndex : '0'}
                    />
                    {this.props.button ? <Button {...this.props.button} /> : null}
                </div>
                {this.props.error ? (
                    <div className="invalid-message">
                        {this.props.errorComputedMessage}
                    </div>
                ) : null}
                {this.props.helpText ? (
                    <small id={`${this.props.id}HelpBlock`}>{this.props.helpText}</small>
                ) : null}
            </div>
        )
    }
}

TextArea.defaultProps = {
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

export { TextArea };