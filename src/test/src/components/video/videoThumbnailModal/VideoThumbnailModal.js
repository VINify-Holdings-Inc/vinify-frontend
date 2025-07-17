import React, { Component } from 'react';

import { VideoThumbnail } from '../';
import { Loading } from '../../shared';

import { GetVideos } from '../../../actions/video';

class VideoThumbnailModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videos: null
        };
    }

    async componentDidMount() {
        this.setState({
            videos: await GetVideos()
        });
    }

    onSelectVideo(video) {
        this.props.onSelectVideo(video);
        document.getElementById('closeModal').click();
    }

    render() {
        return (
            <div>
                {
                    (this.state.videos == null) ?
                        <Loading />
                        :
                        (this.state.videos.length > 0) ?
                            <div>
                                <ul className='snippets-view list-inline'>
                                    {
                                        this.state.videos.map((video, key) => (
                                            <VideoThumbnail onClick={this.onSelectVideo.bind(this, video)} video={video} key={key} />
                                        ))
                                    }
                                </ul>
                            </div>
                            :
                            <div className='row'>
                                <div className='col-lg-12 text-center'>
                                    <p className='lead'>Oops, No media items found.</p>
                                </div>
                            </div>
                }
            </div>
        )
    }
}

export { VideoThumbnailModal };