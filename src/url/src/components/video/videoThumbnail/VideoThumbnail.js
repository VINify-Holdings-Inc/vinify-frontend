import React, { Component } from 'react';

import { VideoThumbnailItem } from '../';
import { Loading } from '../../shared';

import { GetFiles } from '../../../actions/file';

class VideoThumbnail extends Component {
  // state
  state = {
    videos: null
  };

  // LifeCycle Events

  componentDidMount = async () => {
    await this.getVideos();
  };

  // Events

  _onClickThumbnail = video => {
    this.props.onClick(video);
  };

  // Utility

  getVideos = async () => {
    let res = await GetFiles('video');
    if (res.result) {
      this.setState({
        videos: res.body
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.videos == null ? (
          <Loading />
        ) : this.state.videos.length > 0 ? (
          <div>
            <ul className='snippets-view list-inline'>
              {this.state.videos.map((video, key) => (
                <VideoThumbnailItem
                  thumbnail={'default-img.png'}
                  className='video-thumbnail'
                  onClick={this._onClickThumbnail}
                  video={video}
                  key={key}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className='row'>
            <div className='col-lg-12 text-center'>
              <p className='lead'>Oops, No media items found.</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { VideoThumbnail };
