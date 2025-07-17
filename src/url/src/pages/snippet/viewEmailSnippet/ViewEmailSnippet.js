import React, { Component } from "react";
import { connect } from "react-redux";
import Config from '../../../core/config';
import "./ViewEmailSnippet.scss";

import { Loading } from "../../../components/shared";
import { ResourceNotFound } from "../../../components/pagePartial";
import { GetSnippetBySlugLive,GetSnippetBySlug } from "../../../actions/snippet";
import notification from "../../../core/services/alert";
import axios from "axios";
import formatRelativeWithOptions from "date-fns/fp/formatRelativeWithOptions/index.js";
import swal from "sweetalert2";
class ViewEmailSnippet extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.videoRef1 = React.createRef();
    
  }
  // State
  state = {
    playerHeight: 0,
    loading: true,
    snippet: null,
    id: this.props.match.params.id,
    playStartTime: 0,
    totalPlayTime: 0,
      videoDuration: 0,
      ruValue:null,
  };



  getPlayerHeight() {
    if (this.videoRef.current) {
      const height = this.videoRef.current.clientHeight;
      //console.log("heigh   theight",height)
      this.setState({ playerHeight: height });
    }
  }

  // LifeCycle Events

  componentDidMount = async () => {
    await this._handleGenerateCode();
    //console.log("ttet",this.props.snippet);

    const videoElement = this.videoRef1.current;
    videoElement.addEventListener('play', this.handlePlay);
    videoElement.addEventListener('pause', this.handlePause);
   // videoElement.addEventListener('ended', this.handlePause);

  // window.addEventListener("beforeunload", this.handlePause);
     videoElement.addEventListener('loadedmetadata', this.handleLoadedMetadata);

        
     const url = window.location.href;
     const urlObj = new URL(url);
     const ruValue = urlObj.searchParams.get('v');
     const decodedRuValue = ruValue ? decodeURIComponent(ruValue).replace(/^"|"$/g, '') : '';
     this.setState({ ruValue: decodedRuValue });
   



  };

  // Utils
  _handleGenerateCode = async () => {
    let res = await GetSnippetBySlug(this.state.id);
     // console.log("view email",res);
    if (res.result) {
      this.setState({
        snippet: res.body,
        loading: false,
      });
      setTimeout(() => {
       // console.log('Delayed action executed!');
        this.getPlayerHeight();
      }, 2000);

    } else {
      //notification.error("Failed to get html");
      swal("No active campaign found.");
      this.setState({
        loading: false,
      });
    }
  };


 


componentWillUnmount() {
    const videoElement = this.videoRef1.current;
    videoElement.removeEventListener('play', this.handlePlay);
    videoElement.removeEventListener('pause', this.handlePause);
   // videoElement.removeEventListener('ended', this.handlePause);
   

  // window.removeEventListener("beforeunload", this.handlePause);
      videoElement.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
   
}

handlePlay = () => {
    this.setState({ playStartTime: Date.now() });
}

handlePause = () => {
    const { playStartTime, totalPlayTime ,videoDuration} = this.state;
    console.log("videoDuration",videoDuration);
    const currentTime = Date.now();
    const playedDuration = (currentTime - playStartTime) / 1000; // Convert to seconds
    const updatedTotalPlayTime = totalPlayTime + playedDuration;
     // console.log("test",playedDuration);
     // Check if video is paused or ended
     const videoElement = this.videoRef1.current;
     if (!videoElement.paused && !videoElement.ended) return; // Prevent double counting on end      

    this.setState({ totalPlayTime: updatedTotalPlayTime }, () => {
        this.sendPlayData( parseInt(playedDuration), this.state.snippet.snippet, parseInt(videoDuration));
       // this.sendPlayData( parseInt(updatedTotalPlayTime.toFixed(0)),this.state.snippet.snippet);
    });
}


handleLoadedMetadata = () => {
        const videoElement = this.videoRef1.current;
       // console.log("videoElement",videoElement);
        this.setState({ videoDuration: videoElement.duration });
    }

sendPlayData = async (playedDuration,snippetId,totalPlayTimeVideo) => {
  var config = await Config();
      let data = {
          DurationSecs:playedDuration,
          SnippetId:snippetId,
          TotalPlayTimeVideo:totalPlayTimeVideo,
          Receiver:this.state.ruValue,
      }
  try {
      const response = await axios.post(`${config.apiBaseUrl}Reports/UpdateDurationsnippetId`,data ).then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
    
  } catch (error) {
      console.error('Error sending play data:', error);
  }
}

  render() {
  
    return (
      
      <div className="page-view-snippet">
        {this.state.loading ? (
          <div className="center aligned grid">
            <Loading />
          </div>
        ) : this.state.html === null ? (
          <ResourceNotFound title="EyeMail" />
        ) : (
          <>
           <div className="text-center mutebtn">
          
           {this.state.snippet.logoImageUrl && (
                        <div
                          className={`logo ${this.state.snippet.logoImageAlignment}`}
                        >
                          <img
                            src={this.state.snippet.logoImageUrl}
                            className=""
                            style={{
                              display: "inline-block",
                              width: this.state.snippet.logoImageWidth + "px",
                               marginBottom:"16px",
                            }}
                          />
                        </div>
                )}
              {this.state.snippet.coverImageUrl &&
                    this.state.snippet.coverImagePlacement === "above" && (
                      <div className="cover newRules">
                        <img
                          src={this.state.snippet.coverImageUrl}
                          style={{
                            marginBottom:
                            +this.state.snippet.coverImageSpacing*8,
                               width:"100%",
                          }}
                        />
                      </div>
                    )}
               <div>
               <div className="videoSec">    
               {/* { (this.state.snippet.addVideoOverlay?(
                    <span className="micon">
                      { (this.state.snippet.videoOverlay=='black')?
                       
                      <img
                                    src={require(`./../../../content/img/gif-overlay-black.png`)}
                                    className="w-6"
                                    alt=""
                        />
                        :
                       <img
                                    src={require(`./../../../content/img/gif-overlay-white.png`)}
                                    style={{ padding: "2px" }}
                                    className="w-6"
                                   // className="w-6 bg-gray-800"
                                    alt=""
                                  />
                        }
                      </span>
                     ):"")}   */}

              {/*<video ref={this.videoRef} 
                style={{
                  width:this.state.snippet.width,
                  maxWidth: this.state.snippet.width,
                  height:this.state.playerHeight>600 ? "600px":"auto",
                  objectFit:"cover",
                }}
                playsInline
                autoPlay
                controls
                muted
                poster={
                  this.state.snippet.video.thumbnailUrl ||
                  require(`../../../content/img/default-video-thumbnail.png`)
                }
                src={this.state.snippet.video.url}
              />  */}

            
              <video ref={this.videoRef1} 
                  style={{
                    
                    width:this.state.snippet.width,
                    maxWidth: this.state.snippet.width,
                    height:this.state.playerHeight>600 ? "600px":"auto",
                      objectFit:"cover",
                  }}
                  playsInline
                  autoPlay
                  controls
                  muted
                  loop={false}
                  poster={
                    this.state.snippet.video.thumbnailUrl ||
                    require(`../../../content/img/default-video-thumbnail.png`)
                  }
              
              >
                 <source src={this.state.snippet.video.url} type="video/mp4" />
              </video>

                </div>
              </div>

                {this.state.snippet.coverImageUrl &&
                    this.state.snippet.coverImagePlacement === "below" && (
                      <div className="cover newRules">
                        <img
                          src={this.state.snippet.coverImageUrl}
                          style={{
                            marginTop:
                            +this.state.snippet.coverImageSpacing*8,
                              width:"100%",
                          }}
                        />
                      </div>
                    )} 


              {this.state.snippet.ctaButtonsHTML && (
               
                <div className="eight wide tablet column newRules">
                  <div className="mt-4">
                                 
                       <div dangerouslySetInnerHTML={{ __html: this.state.snippet.ctaButtonsHTML }} />
                  </div>
                </div>
                    )}




            </div>
                

          </>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const connectedComponent = connect(mapStateToProps, null)(ViewEmailSnippet);
export { connectedComponent as ViewEmailSnippet };
