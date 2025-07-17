import React, { Component } from 'react';

import './SelectVideo.scss';

import { Button, Icon } from '../../html';
import { UploadVideo } from '../../snippet';
import { VideoModal } from '../videoModal/VideoModal';
import { VideoGrid } from '../videoGrid/VideoGrid';
import { GetFiles } from '../../../actions/file';

class SelectVideo extends Component {
  // state
  state = {
    videos: null
  };

  // LifeCycle Events

  componentDidMount = async () => {
    await this.getVideos();
  };

  // Events

  _onClickTab = ev => {
    let id =
      ev.target.id ||
      ev.target.parentNode.id ||
      ev.target.parentNode.parentNode.id;

    if (id != null && id != '') this.toggleTabs(id);
  };

  _onChangeVideo = video => {
    this.props.onChange(video);
  };

  // Utils

  toggleTabs = tabId => {
    let id = parseInt(tabId.match(/\d+/g), 10);
    let tabs = document.getElementsByClassName('tab-item');

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
    }

    document.getElementById(`tab${id}`).classList.add('active');
    document.getElementById(`tabPane${id}`).classList.add('active');
  };

  onSuccess = res => {
    this.props.onChange(res.body);
  };

  getVideos = async () => {
    let res = await GetFiles('video');
    if (res.result) {
      this.setState({
        videos: res.body
      });
    }
  };

  //Render

  render() {
    return (
      <div className='cmp-select-video'>
        {this.props.value == '' ? (
          <>
            <div className='ui attached tabular menu'>
              <a
                className='active item tab-item'
                id='tab1'
                onClick={this._onClickTab}>
                <Icon icon='desktop' size='1.2' />
                &nbsp; <div className='item-label'>Add from your computer</div>
              </a>
              <a className='item tab-item' id='tab2' onClick={this._onClickTab}>
                <Icon icon='briefcase' size='1.2' />
                &nbsp; <div className='item-label'>Video Gallery</div>
              </a>
            </div>
            <div
              className='ui bottom attached segment active tab tab-item'
              id='tabPane1'>
              <UploadVideo onSuccess={this.onSuccess} />
            </div>
            <div
              className='ui bottom attached segment tab tab-item'
              id='tabPane2'>
              <VideoGrid
                onSelect={this._onChangeVideo}
                videos={this.state.videos}
              />
            </div>
          </>
        ) : (
          <>
            <VideoModal video={this.props.value} />
            <Button
              title='Cancel'
              transparent={true}
              onClick={this.props.onCancel}
            />
          </>
        )}
        {this.props.error ? (
          <div className='invalid-message'>
            {this.props.errorComputedMessage}
          </div>
        ) : null}
      </div>
    );
  }
}

export { SelectVideo };
