import React, { Component } from 'react'
import { Player } from 'video-react';

class PreviewVideo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='row'>
                <div className='col-12'>
                    <p className='mt-2'>
                        <strong>{this.props.video.title}</strong>
                    </p>
                </div>
                <div className='col-xl-6 col-md-6 col-sm-12 col-xs-12'>
                    <Player
                        playsInline
                        poster={this.props.video.thumbnailUrl}
                        src={this.props.video.videoUrl}
                        aspectRatio={'16:9'}
                    />
                </div>
            </div>
        )
    }
}

export { PreviewVideo };