import React, { Component } from 'react';

import './VideoGridItem.scss';

import { Button } from '../../html';
import { DialogBox, ConfirmModal } from '../../shared';
import { VideoModal } from '../';
import { DeleteFile } from '../../../actions/file';

class VideoGridItem extends Component {
  //State
  state = {
    modalOpen: false
  };

  //Events

  _onClickDeleteVideo = () => {
    this.setState({
      modalOpen: true
    });
  };

  _onClickSelectVideo = () => {
    this.props.onSelect(this.props.video.file);
  };

  //Utils

  onConfirm = () => {
    this.deleteVideo(this.props.video.file);
  };

  onCancel = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  };

  getFileName = param => param.replace(/\.[^/.]+$/, '');

  deleteVideo = async id => {
    await DeleteFile(id);
    this.closeModal();
    this.props.updateVideos();
  };

  //Render

  render() {
    return (
      <div className='cmp-video-grid-item' ref={this.props.video.file}>
        <VideoModal
          className='video-thumbnail'
          altText={this.props.video.fileName}
          video={this.props.video.file}
        />
        {this.props.updateVideos ? (
          <div className='video-controls'>
            <p
              className='video-title'
              title={this.getFileName(this.props.video.fileName)}>
              {this.getFileName(this.props.video.fileName)}
            </p>
            <p className='video-created-at'>
              {this.props.video.dateUploadedUTC}
            </p>
            <Button
              fluid={true}
              category={'primary'}
              title='Delete'
              size={'small'}
              onClick={this._onClickDeleteVideo}
            />
          </div>
        ) : (
          <Button
            fluid={true}
            transparent={true}
            title='Select'
            size={'small'}
            onClick={this._onClickSelectVideo}
          />
        )}
        <ConfirmModal
          modalOpen={this.state.modalOpen}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          description={'Do you really want to delete this video?'}
        />
      </div>
    );
  }
}

export { VideoGridItem };
