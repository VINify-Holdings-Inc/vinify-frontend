import React, { Component } from 'react';
import { Player } from 'video-react';
import '../../../../node_modules/video-react/dist/video-react.css';

import { DialogBox } from '../../shared';
import { Icon } from '../../html';
import './VideoModal.scss';
import { GetFileUrl } from '../../../actions/file';

class VideoModal extends Component {
  //Render

  render() {
    return (
      <div className='cmp-video-modal' style={{ width: '360px', margin: '0 auto' }}>
        <DialogBox
          basic={true}
          trigger={
            <div className='thumbnail-container'>
              <img
                className={`thumbnail ${this.props.className}`}
                src={require(`../../../content/img/${this.props.thumbnail}`)}
                alt={this.props.altText}
              />
              {/* <div className='video-play-icon-overlay'>
                <Icon type='regular' size='4' icon='play-circle' />
              </div> */}
            </div>
          }
        >
          <video playsinline autoplay controls muted
            poster={this.props.thumbnailUrl || require(`../../../content/img/default-video-thumbnail.png`)}
            src={this.props.videoUrl} />
          {/* <Player
            playsInline
            poster={require(`../../../content/img/${this.props.thumbnailUrl}`)}
            src={GetFileUrl(this.props.videoUrl)}
            autoPlay={this.props.autoPlay}
            aspectRatio={'16:9'}
          /> */}
        </DialogBox>
      </div>
    );
  }
}

VideoModal.defaultProps = {
  thumbnail: 'default-video-thumbnail.png',
  altText: '',
  autoPlay: true
};

export { VideoModal };
