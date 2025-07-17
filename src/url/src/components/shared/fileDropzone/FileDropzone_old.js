import React, { Component } from 'react';

import './FileDropzone.scss';

import { Icon } from '../../html';
import { ProgressBar } from '../progressBar/ProgressBar';

import { UploadFile, DeleteFile, AbortFetching } from '../../../actions/file';
import notification from '../../../core/services/alert';

class FileDropzone extends Component {
  state = {
    hightlight: false,
    loading: false,
    files: [],
    disabled: false,
    filesUploaded: 0,
    uploadpercentage: 0,
    showVideoSizeError: false
  };

  //LifeCycle Events

  componentWillUnmount = () => { };

  //Events

  _showVideoSizeError = () => {
    this.setState({
      showVideoSizeError: true
    })
  }

  _onClickUploadFile = () => {
    if (this.props.disabled || this.state.disabled) return;
    this.fileInputRef.click();
  };

  _onChange = (ev) => {
    if (this.props.disabled || this.state.disabled) return;

    this.props.onChange && this.props.onChange(ev.target.files);

    this.fileUpload(ev.target.files, false);
  };

  _onDragOverUploadFile = (evt) => {
    evt.preventDefault();

    if (this.props.disabled || this.state.disabled) return;

    this.setState({ hightlight: true });
  };

  _onDragLeaveUploadFile = () => {
    this.setState({ hightlight: false });
  };

  _onDropUploadFile = (ev) => {
    ev.preventDefault();

    if (this.props.disabled || this.state.disabled) return;

    this.fileUpload(ev.dataTransfer.files, true);
  };

  //Utils

  fileListToArray = (list) => {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  toggleHighlight = () => {
    this.setState((prevState) => {
      return {
        hightlight: !prevState.hightlight,
      };
    });
  };

  fileUpload = async (files, toggleHighlight) => {
    if (files.length > 0) {
     // console.log("files[0].size",files[0].size);
      if(files[0].size >  1048576 * 300){
        this._showVideoSizeError();
        return;
      }

      this.setState({
        showVideoSizeError: false
      })

      if (this.props.fileTypes) {
        let fileTypes = this.props.fileTypes;
        fileTypes = fileTypes.split(',').map((el) => el.slice(1));
        if (
          fileTypes.indexOf(
            this.getFileExtension(files[0].name)[0].toLowerCase()
          ) == -1
        ) {
          notification.error('Invalid file type!', 'invalidFileType');
          return;
        }
      }
      this.setState({
        loading: true,
      });
      files[0].fileType = this.props.type;
      const array = this.fileListToArray(files);
      let res, showPreview;
      this.setFilePreview(array[0]);

      res = await UploadFile(array[0], this.props.queryOptions, this.updateUploadPercentage);
      this.setState({
        loading: false,
      });
      if (res.result) {
        showPreview = this.props.onSuccess(res);
      } else {
        showPreview = this.props.onFailure(res);
      }
      if (showPreview !== false) {
        this.setFilePreview(array[0], res);
      }
      if (toggleHighlight) {
        this.toggleHighlight();
      }
    }
  };

  updateUploadPercentage = (uploadpercentage) => {
    this.setState({ uploadpercentage });
  };

  getFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  setFilePreview = async (list = null, res, push = true, fileId = null) => {
    let filesArray = this.state.files;

    if (push && res) {
      let index = filesArray.findIndex((el) => el.name === list.name);
      if (index !== -1) {
        if (res.result) {
          filesArray[index].status = 'uploaded';
        } else {
          filesArray[index].status = 'failed';
        }
        filesArray[index].fileId = res.body.fileId;
      }
    } else if (!push) {
      filesArray = filesArray.filter((element) => element.fileId != fileId);
      this.setState(
        (prevState) => {
          return {
            filesUploaded: prevState.filesUploaded - 1,
          };
        },
        () => {
          if (this.state.filesUploaded < this.props.maxFiles) {
            this.setState({
              disabled: false,
            });
          }
        }
      );
    } else {
      list.status = undefined;
      filesArray.push(list);
      this.setState(
        (prevState) => {
          return {
            filesUploaded: prevState.filesUploaded + 1,
          };
        },
        () => {
          if (this.state.filesUploaded >= this.props.maxFiles) {
            this.setState({
              disabled: true,
            });
          }
        }
      );
    }

    this.setState({
      files: filesArray,
    });
  };

  onBeforeFileRemove = async (file) => {
    if (this.state.files.length > 0) {
      this.setState({
        loading: true,
      });
      if (this.fileInputRef) {
        this.fileInputRef.value = null;
      }
      let res, showPreview;
      if (file.fileId) {
        if (this.props.onBeforeFileRemove) {
          const proceedDeletion = await this.props.onBeforeFileRemove(file.fileId);
          if (proceedDeletion) {
            await DeleteFile(file.fileId);
          }
        } else {
          await DeleteFile(file.fileId);
        }
        this.setState({
          filesUploaded: this.state.filesUploaded - 1,
          disabled: false,
        });
      } else {
        AbortFetching();
      }
      this.setState({
        loading: false,
      });

      try {
        // if (res.result) {
        // showPreview = this.props.onSuccess(res);

        // }
        // else {
        //   showPreview = this.props.onFailure(res);
        // }
        // if (showPreview !== false) {
        this.setFilePreview(null, res, false, file.fileId);
        // }
      } catch (error) {

      }
    }
  };

  getFileExtension = (filename) =>
    /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;

  //Render

  render() {
    return (
        <div tabIndex={0}>
            <div
                className="cmp-file-dropzone"
            >
              {this.state.files.length > 0
                  ? this.state.files.map((file, key) => (
                      <div key={key} id={file.fileId} className="file-preview">
                        {file.status !== 'uploaded' ? (
                            <ProgressBar
                                attached={'top'}
                                indicating={true}
                                count={this.state.uploadpercentage}
                                showProgress={true}
                            />
                        ) : null}
                        <div className="file-details">
                          <div className="file-options">
                            <p className="file-name" title={file.name}>
                              {file.name}&nbsp;
                              {file.status ? (
                                  <span className="file-status">
                          <Icon
                              className={`file-status-${file.status}`}
                              icon={
                                file.status === 'uploaded'
                                    ? 'check'
                                    : file.status === 'failed'
                                        ? 'times'
                                        : ''
                              }
                              size="1.2"
                          />
                        </span>
                              ) : null}
                            </p>
                            <div
                                onClick={(ev) => {
                                  // ev.stopPropagation();
                                  this.onBeforeFileRemove(file);
                                }}
                            >
                              <Icon className="delete-icon" icon="times" size="1.4"/>
                            </div>
                          </div>
                          <div className="file-progress">
                            <p className="file-size">{this.getFileSize(file.size)}</p>
                          </div>
                        </div>
                      </div>
                  ))
                  : null}
              {
                !this.state.disabled && !this.props.disabled &&
                <div
                    className={`dropzone ${this.state.hightlight ? 'highlight' : ''}`}
                    onDragOver={this._onDragOverUploadFile}
                    onDragLeave={this._onDragLeaveUploadFile}
                    onDrop={this._onDropUploadFile}
                    onClick={this._onClickUploadFile}
                    style={{
                      cursor:
                          this.props.disabled || this.state.disabled
                              ? 'default'
                              : 'pointer',
                    }}
                >
                  <input
                      ref={(fileInputRef) => (this.fileInputRef = fileInputRef)}
                      className="fileInput"
                      type="file"
                      accept={this.props.fileTypes}
                      onChange={this._onChange}
                  />
                  <div>
                    <Icon className="upload-icon" icon="cloud-upload-alt" size="2"/>
                    <div>Drop {this.props.maxFiles > 1 ? 'files' : 'file'} to upload or click here to browse</div>
                  </div>
                </div>
              }
            </div>

              { this.state.showVideoSizeError &&
                <div style={{marginTop: "15px",marginBottom: "5px",color:"#E61F27"}}>Max video size is 300mb</div>
              }
        </div>
    );
  }
}

FileDropzone.defaultProps = {
  fileTypes: undefined,
  disabled: false,
  maxFiles: 1,
  type: 'any',
  queryOptions: {}
};

export { FileDropzone };
