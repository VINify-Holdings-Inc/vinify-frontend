import React, { Component } from 'react';

class SnippetCampaignUrl extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='form-group'>
                <label htmlFor='snippetCampaignUrl'>
                    {this.props.label ? this.props.label : 'Your email campaign live url:'} &nbsp;
                    <span className='fas fa-info-circle' data-toggle='tooltip' data-placement='top' title='To enable EyeMail video experience in Outlook, enter the url for the web version of the email campaign'></span>
                </label>
                <input type='url' name="url" value={this.props.url} onChange={(event) => this.props.onChange(event.target.value)} className='form-control' id='snippetCampaignUrl' />
                <span className='invalid-feedback'>
                    Invalid url.
                </span>
            </div>
        )
    }
}

export { SnippetCampaignUrl };