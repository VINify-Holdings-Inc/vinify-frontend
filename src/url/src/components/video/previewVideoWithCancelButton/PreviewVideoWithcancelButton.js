import React, { Component } from 'react'

import Player from 'video-react/lib/components/Player';

class PreviewVideoWithCancelButton extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className='col-12'>
                    <p className='mt-2'>
                        <strong>{this.props.video.title}</strong>
                    </p>
                </div>
                <div className='col-xl-12 col-md-12 col-sm-12 col-xs-12'>
                    <Player
                        playsInline
                        poster={this.props.video.thumbnailUrl}
                        src={this.props.video.videoUrl}
                        aspectRatio={'30:20'}
                    />
                </div>
                <div className='row'>
                    <div className='col-12 mt-2'>
                        <div className='btn-group'>
                            <button className='btn btn-light' onClick={() => this.props.onChange(null)}><i className='fas fa-times-circle'></i> Clear Selection</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { PreviewVideoWithCancelButton };