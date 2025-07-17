import React, { Component } from 'react';

import { TextBox, Label } from '../../../components/html';

class FormControl extends Component {
    render() {
        return (
            <div className='form-group'>
                <Label htmlFor={this.props.id} title={this.props.title} />
                <TextBox
                    value={this.props.value}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    type={this.props.type}
                    onChange={this.props.onChange}
                    id={this.props.id}
                    required={this.props.required}
                    helpText={this.props.helpText}
                    autoComplete={this.props.autoComplete}
                />
                <div className='invalid-feedback'>
                    {this.props.invalidMessage}
                </div>
            </div>
        )
    }
}

FormControl.defaultProps = {
    title: '',
    autoComplete: '',
    value: '',
    name: '',
    placeholder: '',
    type: 'text',
    hidden: false,
    required: false,
    invalidMessage: '',
    helpText: null
}

export { FormControl };