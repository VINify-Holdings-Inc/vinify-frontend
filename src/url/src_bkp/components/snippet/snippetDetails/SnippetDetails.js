import React, { Component } from "react";
import { connect } from "react-redux";

import "./SnippetDetails.scss";

import { ExportSnippet } from "..";
import { Button } from "../../html";
import { DialogBox, ConfirmModal } from "../../shared";

import notification from "../../../core/services/alert";
import {
  GetSnippetHtmlCode,
  UpdateSnippetStatus,deleteSnippetId
} from "../../../actions/snippet";

import Config from "../../../core/config/";
import { GetPlatforms } from "../../../actions/global";
import sitemap from "../../../sitemap";
import Swal from 'sweetalert2'
import history from '../../../history';
var config;

class SnippetDetails extends Component {
  //State
    constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    
  }

  state = {
    playerHeight: 0,
    openActivateModal: false,
    openDeactivateModal: false,
    openDownloadModal: false,
    generateHtmlCodeForm: {
      platform: {
        label: "Email Provider Platform",
        options: [],
        value: "",
        fluid: true,
        selection: true,
        required: true,
        id: "platform",
        name: "platform",
        placeholder: "Select Type",
        onChange: (event) => this._onChange(event),
      },
    },
    previewUrl: "-",
    html: "-",
    copied: false,
    btnStatus:false,
  };
  _handleGenerateCode = async () => {
    let res = await GetSnippetHtmlCode(this.props.snippet.snippet);

    if (res.result) {
      this.setState({
        html: res.body,
      });
    } else {
      notification.error("Failed to get html");
    }
  };
  click () {
    const blob = new Blob([this.state.html], {
      type: "text/html;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.props.snippet.title + ".html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // LifeCycle Events

  componentDidMount = async () => {
    config = await Config();
    //console.log("setGet Data",this.props.snippet);
    this.setState({
      previewUrl: config.baseUrl + this.props.snippet.previewUrl,
      btnStatus:  this.props.snippet.status,
    });
    await this.getPlatforms();
    this._handleGenerateCode();
    //this.getPlayerHeight();
  };

  //Events

  _onClickActivateSnippet = () => {
    this.setState({
      openActivateModal: true,
    });  

      Swal.fire({
          title: "Are you sure?",
          text: "You want to activate this eyemail!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, activate this eyemail!"
        }).then((result) => {
    
       if (result.value) {
         this.updateSnippetStatus(true);
     
        }
        });   
  };

  _onClickDeactivateSnippet = () => {
     this.setState({
       openDeactivateModal: true,
     });  

      Swal.fire({
          title: "Are you sure?",
          text: "You want to deactivate this eyemail!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, deactivate this eyemail!"
        }).then((result) => {
    
       if (result.value) {
         this.updateSnippetStatus(false);
     
        }
  });
  };

  _onClickDeleteSnippet = () => {
   
     Swal.fire({
         title: "Are you sure?",
         text: "You want to delete this eyemail!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete this eyemail!"
       }).then((result) => {
   
      if (result.value) {
        this.deleteSnippet();
    
       }
 });
 };

  getPlayerHeight() {
    if (this.videoRef.current) {
      const height = this.videoRef.current.clientHeight;
      //console.log("gg",height)
      this.setState({ playerHeight: height });
    }
  }


  _onClickDownloadSnippet = () => {
    this.setState({
      openDownloadModal: true,
    });
  };

  _onFinishDownloadSnippet = () => {
    this.setState({
      openDownloadModal: false,
    });
  };

  _onExportModalClose = () => {
    this.setState({
      openDownloadModal: false,
    });
  };

  _onClickEdit = () => {
    window.location.href = `${this.props.sitemap.routes.editSnippet.route}/${this.props.snippet.snippet}`;
  };

  //Utils

  onCancel = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.setState({
      openActivateModal: false,
      openDeactivateModal: false,
    });
  };

  updateSnippetStatus = async (status) => {
    let snippet = {
      snippetId: this.props.snippet.snippet,
      status: status,
    };
    let res = await UpdateSnippetStatus(snippet);
    if (res.result) {
      snippet = this.props.snippet;
      snippet.status = status;
      this.props.setSnippet(snippet);
       
       this.setState({btnStatus: status,});

    /*  notification.success(
        `EyeMail has been ${status ? `activated` : `deactivated`}`,
        "snippetUpdateSuccess"
      ); */
       Swal.fire({
              title: `${status ? 'Activated!' : 'Deactivated!'}`,
              text: `This Eyemail ${status ? 'activated' : 'deactivated'} successfully`,
              icon: "success"
            });
    } else {
     /* notification.error("Failed to update status.", "snippetUpdateFailed");  */
       Swal.fire({
              title: "Failed!",
              text: `Failed to ${status ? 'activate' : 'deactivate'} this Eyemail`,
              icon: "warning"
            });
    }
  //  this.onCancel();
    //console.log("test", this.props);
  };


  
  deleteSnippet = async () => {
    let snippet = {
      SnippetId: this.props.snippet.snippet,
      
    };
    let res = await deleteSnippetId(snippet);
    if (res.result) {
      snippet = this.props.snippet;
      this.props.setSnippet(snippet);
       
     

       Swal.fire({
              title: `${this.props.snippet.title}`,
              text: `Eyemail deleted successfully`,
              icon: "success"
            });
            history.push('/');   

    } else {
     
       Swal.fire({
              title: "Failed!",
              text: `Failed to delete this Eyemail`,
              icon: "warning"
            });
            
    }

  };

  getPlatforms = async () => {
    let res = await GetPlatforms();

    if (res.result) {
      let generateHtmlCodeForm = this.state.generateHtmlCodeForm;
      generateHtmlCodeForm.platform.options = res.body.map((platform) => ({
        key: platform.code,
        text: platform.name,
        value: platform.code,
        image: {
          avatar: true,
          src: require(`../../../content${platform.iconUrl}`),
        },
      }));
      this.setState({
        generateHtmlCodeForm: generateHtmlCodeForm,
      });
      setTimeout(() => {
        //console.log('Delayed action executed!');
        this.getPlayerHeight();
      }, 2000);
    }
  };

  render() {
    return (
      <div>
        <header className="flex flex-col md:flex-row gap-y-5 md:gap-x-8 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-y-3 items-center md:gap-x-3 text-center md:text-left">
            <span
              className={`${
                this.props.snippet.status
                  ? "bg-green-600 text-green-900 rounded px-3 py-1 font-bold text-sm"
                  : "bg-gray-400 text-gray-900 rounded px-3 py-1 font-bold text-sm"
              }`}
            >
              {this.state.btnStatus? "Active" : "Inactive"}
            </span>

            <div>
              <h1 className="text-2xl font-bold mb-0">
                {this.props.snippet.title}
              </h1>

              <a
                href={`${sitemap.routes.viewLiveSnippet.route}/${this.props.snippet.snippet}`}
                target="_blank"
                className="flex justify-center md:justify-start items-center gap-x-1 text-sm group text-light-rose-dark"
              >
                <svg
                  className="h-4 text-light-rose-dark fill-current group-hover:text-gray-900 transition duration-500"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                    fillRule="nonzero"
                  />
                </svg>
                Preview
              </a>
            </div>
          </div>

          <Button
            className="button-secondary"
            title="Modify"
            iconType={"solid"}
            icon={"edit"}
            onClick={this._onClickEdit}
            text="Modify"
          />
        </header>

        <div className="w-full md:w-11/12 xl:w-10/12 2xl:w-8/12 mx-auto mt-6">
          <div className="flex flex-col-reverse lg:flex-row gap-y-5 md:gap-x-8 items-center">
            <div className="flex flex-col items-center px-8 pb-8">
              <div className="mb-4 w-full">
                <Button
                  className={this.state.btnStatus?"brand":"brand btnGrey"}
                //  className="brand"
                  fullWidth="true"
                  title={"Download"}
                  onClick={this._onClickDownloadSnippet}
                  disabled={this.state.btnStatus?false:true}
                />
              </div>

              {/* <div className="mb-4 w-full">
                <Button
                  link={
                    sitemap.routes.reportsWithId.route +
                    "/" +
                    this.props.snippet.snippet
                  }
                  fullWidth="true"
                  className="button-secondary"
                  title={"Reports"}
                />
              </div> */}

               <div className="mb-4 w-full cmp-button txt">
                      <a
                        href={`${sitemap.routes.viewLiveSnippet.route}/${this.props.snippet.snippet}`}
                        target="_blank"
                        className=" button-secondary"
                      >
                       Preview
                      </a>
              </div> 

              <span className="border-t border-gray-200 w-24 mt-2">&nbsp;</span>

              {this.state.btnStatus ? (
                <Button
                  className="button-secondary deactivate"
                  fullWidth="true"
                  title={"Deactivate"}
                  onClick={this._onClickDeactivateSnippet}
                />
              ) : (
                <Button
                  className="button-secondary"
                  fullWidth="true"
                  title={"Activate"}
                  onClick={this._onClickActivateSnippet}
                />
              )}

              <div className="mt-4 w-full">
                <Button
                  className="brand"
                  fullWidth="true"
                  title={"Delete"}
                  onClick={this._onClickDeleteSnippet}
                />
              </div>
            </div>

            <div className="text-center mutebtn">
               
                {this.props.snippet.logoImageUrl && (
                        <div
                          className={`logo ${this.props.snippet.logoImageAlignment}`}
                        >
                          <img
                            src={this.props.snippet.logoImageUrl}
                            className=""
                            style={{
                              display: "inline-block",
                              width: this.props.snippet.logoImageWidth + "px",
                               marginBottom:"16px",
                            }}
                          />
                        </div>
                )}

              {this.props.snippet.coverImageUrl &&
                    this.props.snippet.coverImagePlacement === "above" && (
                      <div className="cover newRules">
                        <img
                          src={this.props.snippet.coverImageUrl}
                          style={{
                            marginBottom:+this.props.snippet.coverImageSpacing*8,
                            width:"100%",
                          }}
                        />
                      </div>
                    )}
            <div className="videoSec">
              { (this.props.snippet.addVideoOverlay?(
                    <span className="micon">
                      { (this.props.snippet.videoOverlay=='black')?
                       
                      <img
                                    src={require(`./../../../content/img/gif-overlay-black.png`)}
                                    className="w-6"
                                    alt=""
                        />
                        :
                       <img
                                    src={require(`./../../../content/img/gif-overlay-white.png`)}
                                    style={{ padding: "2px" }}
                                  //  className="w-6 bg-gray-800"
                                    className="w-6"
                                    alt=""
                                  />
                        }
                      </span>
                     ):"")}       
                
              <video  ref={this.videoRef} 
                style={{
                  width: "100%",
                  maxWidth: this.props.snippet.width,
                  height:this.state.playerHeight>600 ? "600px":"auto",
                  objectFit:"cover",
                }}
                playsInline
                autoPlay
                controls
                muted
                poster={
                  this.props.snippet.video.thumbnailUrl ||
                  require(`../../../content/img/default-video-thumbnail.png`)
                }
                src={this.props.snippet.video.url}
              />
            </div>
               {this.props.snippet.coverImageUrl &&
                    this.props.snippet.coverImagePlacement === "below" && (
                      <div className="cover newRules">
                        <img
                          src={this.props.snippet.coverImageUrl}
                          style={{
                            marginTop:+this.props.snippet.coverImageSpacing*8,
                            width:"100%",


                          }}
                        />
                      </div>
                    )} 

              <div className="row">
                {this.props.snippet.liveUrl !==
                  this.props.snippet.landingPageUrl && (
                  <div className="eight wide tablet column">
                    <div className="mt-4">
                      <div>Web View URL</div>
                      <div>
                        <strong>
                          <a target="_blank" href={this.props.snippet.liveUrl}>
                            {this.props.snippet.liveUrl}
                          </a>
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
                <div className="eight wide tablet column">
                  <div className="mt-4">
                    <div className="text-light-rose-dark">Landing Page URL</div>
                    <div>
                      <strong>
                        <a
                          className="text-light-rose-dark"
                          target="_blank"
                          href={this.props.snippet.landingPageUrl}
                        >
                          {this.props.snippet.landingPageUrl}
                        </a>
                      </strong>
                    </div>
                  </div>
                </div>
               
                {/*added */}
                {this.props.snippet.ctaButtonsHTML && (
               
                <div className="eight wide tablet column">
                  <div className="mt-4">
                    {/* <div className="text-light-rose-dark">Call to action button</div> */} 
                   
                       <div dangerouslySetInnerHTML={{ __html: this.props.snippet.ctaButtonsHTML }} />
                  </div>
                </div>
                    )}


              </div>
            </div>
          </div>
        </div>

        <DialogBox
          modalOpen={this.state.openDownloadModal}
          onClose={this._onExportModalClose}
          inline={true}
          title="Download or Copy HTML"
          children={
            <ExportSnippet
              snippet={this.props.snippet}
              exportUrl={this.props.snippet.exportUrl}
              previewUrl={this.props.snippet.livePreviewUrlForEmail}
              platforms={this.state.generateHtmlCodeForm.platform.options}
              selectedPlatform={this.state.generateHtmlCodeForm.platform.value}
              onFinish={this._onFinishDownloadSnippet}
            />
          }
        />
       {/* <ConfirmModal
          modalOpen={this.state.openActivateModal}
          onConfirm={() => {
            this.updateSnippetStatus(true);
          }}
          onCancel={this.onCancel}
          description={"Do you want to activate this EyeMail?"}
          confirmText={"Activate"}
        />
        <ConfirmModal
          modalOpen={this.state.openDeactivateModal}
          onConfirm={() => {
            this.updateSnippetStatus(false);
          }}
          onCancel={this.onCancel}
          confirmText={"Deactivate"}
          description={"Do you want to deactivate this EyeMail?"}
        />  */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sitemap: state.FlagReducer.Sitemap,
  };
};

const connectedComponent = connect(mapStateToProps, null)(SnippetDetails);

export { connectedComponent as SnippetDetails };
