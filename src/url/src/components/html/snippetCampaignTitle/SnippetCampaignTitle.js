import React, { Component } from 'react';

class SnippetCampaignTitle extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='form-group'>
                <label htmlFor='snippetCampaignTitle'>
                    {this.props.label ? this.props.label : 'Title for the EyeMail:'}
                </label>
                <input type='text' name='title' value={this.props.title} onChange={(event) => this.props.onChange(event)} className='form-control' id='snippetCampaignTitle' />
                <span className='invalid-feedback'>
                    Invalid title.
                </span>
            </div>
        )
    }
}

export { SnippetCampaignTitle };