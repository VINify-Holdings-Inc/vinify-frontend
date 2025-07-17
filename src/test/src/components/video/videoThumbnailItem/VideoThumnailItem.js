import React, { Component } from 'react';

class VideoThumbnailItem extends Component {
  
  // Events
  _onClick = () => {
    this.props.onClick(this.props.video.file);
  };

  //Render

  render() {
    return (
      <div className='cmp-video-grid-item' ref={this.props.video.file}>
        <div className='video-controls' onClick={this._onClick}>
          <p className='video-title' title={this.props.video.fileName}>
            {this.props.video.fileName}
          </p>
          <p className='video-created-at'>{this.props.video.dateUploadedUTC}</p>
        </div>
      </div>
    );
  }
}

export { VideoThumbnailItem };
