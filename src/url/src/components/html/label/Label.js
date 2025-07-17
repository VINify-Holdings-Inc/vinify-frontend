import React, { Component } from 'react';
import './style.css';

class Label extends Component {
    render() {
        return (
            <label htmlFor={this.props.htmlFor} className={this.props.className}>{this.props.title}</label>
        )
    }
}

export { Label };