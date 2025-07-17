import React, { Component } from 'react';
import { connect } from 'react-redux';

// import './UploadVideo.scss';

import { FileDropzone } from '../../shared';

class UploadVideo extends Component {
  //Utils

  onSuccess = (res) => {
    if (this.props.onSuccess) {
      this.props.onSuccess(res);
    }
    return true;
  };

  onFailure = (res) => {
    if (this.props.onFailure) {
      this.props.onFailure(res);
    }
    return true;
  };

  //Render

  render() {
    return (
      <>
        <FileDropzone
          {...this.props}
          type="video"
          fileTypes=".mp4,.mov"
          onChange={this.props.onChange}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
        />

        {this.props.helpText ? (
            <small id={`${this.props.id}HelpBlock`} className='block text-light-rose-dark' style={{"color":(this.props.helpText=="Please upload .mp4 or .mov file only")?"red":""}} >{this.props.helpText}</small>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadVideo);

export { connectedComponent as UploadVideo };
