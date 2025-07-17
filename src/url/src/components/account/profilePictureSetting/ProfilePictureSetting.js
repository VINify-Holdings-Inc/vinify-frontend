import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ProfilePictureSetting.scss';

import { Loading } from '../../shared';
import { ButtonGroup } from '../../html';

import notification from '../../../core/services/alert';
import { UploadFile, DeleteFile, GetFileUrl } from '../../../actions/file';
import { ChangeProfile } from '../../../actions/system';
import { UpdateProfilePicture, GetProfile } from '../../../actions/user';

class ProfilePictureSetting extends Component {
  // State

  state = {
    loading: false,
    uploadedFileId: null,
    profilePictureUrl: this.props.profilePictureUrl
  };

  //Events

  _onClickUploadPhoto = ev => {
    this.fileUpload(ev.target.files);
  };

  _onClickSaveProfilePicture = async () => {
    this.setState({
      loading: true
    });
    let res = await UpdateProfilePicture(this.state.uploadedFileId);
    if (res.result) {
      this.setState({
        uploadedFileId: null,
        loading: false
      });
      notification.success(
        'Picture updated successfully',
        'pictureUpdateSuccess'
      );
    } else {
      notification.error(res.message, 'pictureUpdateFailed');
    }
  };

  _onClickCancelProfilePicture = async () => {
    await DeleteFile(this.state.profilePicture);
    this.setState({
      uploadedFileId: null,
      profilePictureUrl: this.props.profilePictureUrl
    });
  };

  //Utils

  fileUpload = async file => {
    if (file.length > 0) {
      this.setState({
        loading: true
      });
      file[0].fileType = 'image';
      let res = await UploadFile(file[0]);
      if (res.result) {
        const { fileId, url } = res.body;
        this.setState(
          {
            uploadedFileId: fileId,
            profilePictureUrl: url
          },
          () => {
            this.setState({
              loading: false
            });
          }
        );
      }
      else {
        this.setState({
          loading: false,
        });
        notification.error('Fail to upload try again', 'pictureUploadFailed');
      }
    } else {
      notification.error('Fail to upload try again', 'pictureUploadFailed');
    }
  };

  render() {
    return (
      <div className='cmp-profile-picture-settings mt-6'>
        <h2 className='text-xl font-bold mb-4'>Profile Photo</h2>
        <div className='update-photo flex flex-col xl:flex-row'>
          {this.state.uploadedFileId == null ? (
            <img
              src={
                this.state.profilePictureUrl != null
                  ? this.state.profilePictureUrl
                  : require(`../../../content/img/default-img.png`)
              }
              style={{flex: 'none'}}
              alt='Profile Picture'
              className='ui small circular left floated image profile-photo'
            />
          ) : (
              <img
                src={`${this.state.profilePictureUrl}`}
                alt='Uploaded Profile Picture Preview'
                style={{flex: 'none'}}
                className='ui small circular left floated image profile-photo'
              />
            )}

          <div>
            <h4>Upload your photo...</h4>
            <p>
              Photo should be at least 300px <span className='px'>by</span> 300px
            </p>

            {this.state.loading ? (
                <div>
                  <Loading />
                </div>
            ) : this.state.uploadedFileId == null ? (
                <label className='clickable px-4 py-3 font-bold text-primary bg-white border-2 border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 inline-block'>
                  <div className='text-center'>Upload</div>
                  <input
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      onChange={this._onClickUploadPhoto}
                      hidden
                  />
                </label>
            ) : (
                <div>
                  <ButtonGroup
                      category={'primary'}
                      conditional={true}
                      buttons={[
                        { title: 'Save', onClick: this._onClickSaveProfilePicture },
                        {
                          title: 'Cancel',
                          onClick: this._onClickCancelProfilePicture
                        }
                      ]}
                  />
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const connectedComponent = connect(
  null,
  { ChangeProfile }
)(ProfilePictureSetting);

export { connectedComponent as ProfilePictureSetting };
