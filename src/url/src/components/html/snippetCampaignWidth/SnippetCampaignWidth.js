import React, { Component } from 'react';

class SnippetCampaignWidth extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='form-group'>
                <label htmlFor='snippetCampaignWidth'>
                    {this.props.label ? this.props.label : 'Video container width (px):'} &nbsp;
                    <span className='fas fa-info-circle' data-toggle='tooltip' data-placement='top' title='The video container width for your html placement'></span>
                </label>
                <input type='number' name="width" value={this.props.width} onChange={(event) => this.props.onChange(event)} className='form-control' id='snippetCampaignWidth' />
                <span className='invalid-feedback'>
                    Invalid width.
                </span>
            </div>
        )
    }
}

export { SnippetCampaignWidth };