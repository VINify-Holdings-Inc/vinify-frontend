import React, { Component } from 'react';

import './FileDropzone.scss';

import { Icon } from '../../html';
import { ProgressBar } from '../progressBar/ProgressBar';

import { UploadFile, DeleteFile, AbortFetching } from '../../../actions/file';
import notification from '../../../core/services/alert';
import Resizer from 'react-image-file-resizer';
class FileDropzone extends Component {
  state = {
    hightlight: false,
    loading: false,
    files: [],
    disabled: false,
    filesUploaded: 0,
    uploadpercentage: 0,
    showVideoSizeError: false,
    showImgSizeError:false,
    fileExtension:null,
    duplicateFileError: false, // Added to handle duplicate file error
  };


  // LifeCycle Events
  componentWillUnmount = () => {};

  // Events
  _showVideoSizeError = () => {
    this.setState({
      showVideoSizeError: true,
     
    });
  };

  _showImgSizeError = () => {
    this.setState({
      showImgSizeError: true,
     
    });
  };



  _onClickUploadFile = () => {
    if (this.props.disabled || this.state.disabled) return;
    this.fileInputRef.click();
  };

  _onChange = async (ev) => {
    if (this.props.disabled || this.state.disabled) return;

    // Persist the event to access its properties asynchronously
   // ev.persist();
    
    // Copy the files array
    const files = ev.target.files;
    if (files.length === 0) return;
   
    //checking file type
    const fileName = files[0].name
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    this.setState({ fileExtension: fileExtension });

    // Check for duplicate files
    if (this.isDuplicateFile(files[0])) {
      this.setState({ duplicateFileError: true });
      return;
    } else {
      this.setState({ duplicateFileError: false });
    }


    this.props.onChange && this.props.onChange(files);
   // console.log("ev.target.files", files);

    if (this.props.type === "image-img") {
      
      if(fileExtension=='gif'){
       // console.log("get datat",files);
        await this.fileUpload(files, false);
      }else{
        const imgBase64 = await this.resizeFile(files[0]);
        const fileList = await this.fileToFileList(imgBase64);
        await this.fileUpload(fileList, false);
      }
    } else {
      await this.fileUpload(files, false);
    }
    if (this.fileInputRef) this.fileInputRef.value = null;
  };

  _onDragOverUploadFile = (evt) => {
    evt.preventDefault();
    if (this.props.disabled || this.state.disabled) return;
    this.setState({ hightlight: true });
  };

  _onDragLeaveUploadFile = () => {
    this.setState({ hightlight: false });
  };

  _onDropUploadFile = async(ev) => {
    ev.preventDefault();
    if (this.props.disabled || this.state.disabled) return;
   // this.fileUpload(ev.dataTransfer.files, true);

       // Copy the files array
       const files = ev.dataTransfer.files;

       if (files.length === 0) return;
      //checking file type
    const fileName = files[0].name
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    this.setState({ fileExtension: fileExtension });

        // Check for duplicate files
    if (this.isDuplicateFile(files[0])) {
      this.setState({ duplicateFileError: true });
      return;
    } else {
      this.setState({ duplicateFileError: false });
    }


       //added  17-07-24
       this.props.onChange && this.props.onChange(files);
      
       if (this.props.type === "image-img") {
            
        if(fileExtension=='gif'){
          // console.log("get datat",files);
           await this.fileUpload(files, false);
         }else{
           const imgBase64 = await this.resizeFile(files[0]);
           const fileList = await this.fileToFileList(imgBase64);
           await this.fileUpload(fileList, false);
         }

       } else {
         await this.fileUpload(files, false);
       }

       if (this.fileInputRef) this.fileInputRef.value = null;

  };

  // Utils
  fileListToArray = (list) => {
   // console.log("test",list);
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  toggleHighlight = () => {
    this.setState((prevState) => ({
      hightlight: !prevState.hightlight,
    }));
  };

  fileUpload = async (files, toggleHighlight) => {
    if (files.length > 0) {
       // console.log("test img size",this.props.type);
      if (files[0].size > 1048576 * 300) {
        this._showVideoSizeError();
        return;
      }
           //img size
          if(this.props.type=="image-img"){
          //  console.log("test img size",this.props.type);
            if (files[0].size > 1048576 * 15) {
              this._showImgSizeError();
              return;
            }
          }
        
      this.setState({
        showVideoSizeError: false,
        showImgSizeError:false
      });
   

      if (this.props.fileTypes) {
        let fileTypes = this.props.fileTypes.split(',').map((el) => el.slice(1));
       
        if (
          fileTypes.indexOf(
            this.getFileExtension(files[0]?.name)[0].toLowerCase()
          ) === -1
        ) {
          notification.error('Invalid file type!', 'invalidFileType');
          return;
        }
      }

      this.setState({
        loading: true,
      });

        //check gif or img
      if(this.props.type=="image-img"){
        if(this.state.fileExtension=='gif'){
          files[0].fileType = "gif";
        }else{
          files[0].fileType = "image";
        }
       
      }else{
        files[0].fileType = this.props.type; 
      }
      //files[0].fileType = this.props.type;
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
        filesArray[index].fileId = res.body?.fileId;
      }
    } else if (!push) {
      filesArray = filesArray.filter((element) => element.fileId !== fileId);
      this.setState(
        (prevState) => ({
          filesUploaded: prevState.filesUploaded - 1,
        }),
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
        (prevState) => ({
          filesUploaded: prevState.filesUploaded + 1,
        }),
        () => {
           console.log("testttt",this.state.files.length);
      //    if (this.state.filesUploaded >= this.props.maxFiles) {
          if (this.state.files.length >= this.props.maxFiles) {
          
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
    console.log(this.state.files.length);
    if (this.state.files.length > 0) {
      this.setState({
        loading: true,
      });

      if (this.fileInputRef) {
        this.fileInputRef.value = null;
      }

      if (file.fileId) {
        if (this.props.onBeforeFileRemove) {
         // const proceedDeletion = await this.props.onBeforeFileRemove(file.fileId);  9/9/2024
          const proceedDeletion = await this.props.onBeforeFileRemove(file);
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
       await AbortFetching();
        this.setState({
          filesUploaded: 0,
          disabled: false,
          files:[]
        });
      }

      this.setState({
        loading: false,
      });

      this.setFilePreview(null, null, false, file.fileId);
    }
  };

  getFileExtension = (filename) =>
    /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;

  resizeFile = (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600, // width
        600, // height
        'JPEG', // format
        100, // quality
        0, // rotation
        (uri) => {
         // console.log("resizefile",file)
          // Ensure the type is correct here
          fetch(uri)
            .then((res) => res.blob())
            .then((blob) => {
              const newFile = new File([blob], file.name, {
                type: file.type, // Ensure the type matches the original file's type
                lastModified: Date.now(),
              });
              resolve(newFile);
            });
        },
        'base64' // Output type
      );
    });
  };

   
  
  fileToFileList = (file) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };
   
  //line 377 !this.state.disabled && !this.props.disabled &&  this.state.files.length ==0 &&


// Helper method to check for duplicate files
isDuplicateFile = (newFile) => {
  return this.state.files.some((file) => file.name === newFile.name && file.size === newFile.size);
};

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
                (!this.state.disabled && !this.props.disabled && ((this.props.maxFiles!=3)?this.state.files==0?true:false:true) )?
                  
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
                </div>:""
              }
            </div>

              { this.state.showVideoSizeError &&
                <div style={{marginTop: "15px",marginBottom: "5px",color:"#E61F27"}}>Max video size is 300mb</div>
              }
               { this.state.showImgSizeError &&
                <div style={{marginTop: "15px",marginBottom: "5px",color:"#E61F27"}}>Max image size is 15mb</div>
              }
               {this.state.duplicateFileError && (
            <div style={{ marginTop: '15px', marginBottom: '5px', color: '#E61F27' }}>
              Duplicate file detected
            </div>
          )}
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
