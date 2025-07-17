import React, { Component } from 'react';

import { VideoGridItem } from '../';
import { Loading } from '../../shared';

import './VideoGrid.scss';

class VideoGrid extends Component {
  //State

  state = {
    video: null
  };

  //Utils

  pause() {
    this.refs.player.pause();
  }

  setSelectedVideo(video) {
    this.setState({
      video: video
    });
  }

  //Render

  render() {
    return (
      <div className='cmp-video-grid'>
        {this.props.videos === null || this.props.videos === undefined ? (
          <div className='ui center aligned grid'>
            <Loading />
          </div>
        ) : this.props.videos.length > 0 ? (
          <div className='ui grid'>
            <div className='row'>
              {this.props.videos.map((video, key) => {
                return (
                  <div
                    key={key}
                    className='three wide widescreen four wide computer eight wide tablet sixteen wide mobile column'>
                    <VideoGridItem
                      onSelect={this.props.onSelect}
                      onClickThumbnail={this.setSelectedVideo.bind(this)}
                      updateVideos={this.props.updateVideos}
                      video={video}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className='ui center aligned grid'>
            <p className='feedback-text'>No videos found.</p>
          </div>
        )}
      </div>
    );
  }
}

export { VideoGrid };
