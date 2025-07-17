import React, { Component } from 'react';

import './style.css';

class RadioButton extends Component {
    render() {
        return (
            <div>
                <label className="custom-radiobutton"> {this.props.title}
                    <input className="form-check-input" type="radio" name={this.props.name} id={this.props.id}
                        value={this.props.value} checked={this.props.checked} disabled={this.props.disabled}
                        onChange={(event) => this.props.onChange(event)}
                    />
                    <span className="checkmark"></span>
                </label>
            </div>
        )
    }
}

RadioButton.defaultProps = {
    name: '',
    id: '',
    title: '',
    checked: false,
    disabled: false
}

export { RadioButton };