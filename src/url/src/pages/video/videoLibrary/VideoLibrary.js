import React, { Component } from 'react';

import './VideoLibrary.scss';

import { VideoGrid } from '../../../components/video';

import { Icon, Button } from '../../../components/html';
import { UploadVideo } from '../../../components/snippet';
import { DialogBox } from '../../../components/shared';
import { GetFiles } from '../../../actions/file';

class VideoLibrary extends Component {
  //State

  state = {
    videos: null,
    uploading: false
  };

  //LifeCycle Events

  componentDidMount = async () => {
    await this.getVideos();
  };

  componentWillUnmount = () => {
    window.onbeforeunload = undefined;
  };

  //Utils

  getVideos = async () => {
    let res = await GetFiles('video');
    if (res.result) {
      this.setState({
        videos: res.body
      });
    }
  };

  onSuccess = res => {
    this.getVideos();
  };

  //Render

  render() {
    return (
      <div className='page-video-library'>
        <div className='ui grid'>
          <div className='row'>
            <div className='sixteen wide mobile column'>
              <div className='head'>
                <h1 className='title'>
                  <Icon icon='video' size='2.8' /> My Videos
                </h1>
                <DialogBox
                  size='tiny'
                  trigger={<Button title='Upload' icon='cloud-upload-alt' />}>
                  <UploadVideo onSuccess={this.onSuccess} />
                </DialogBox>
              </div>
            </div>
          </div>
        </div>
        <VideoGrid updateVideos={this.getVideos} videos={this.state.videos} />
      </div>
    );
  }
}

export { VideoLibrary };
