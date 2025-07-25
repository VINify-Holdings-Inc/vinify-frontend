import React, { Component } from "react";
import { connect } from "react-redux";

import "./ViewEmailSnippet.scss";

import { Loading } from "../../../components/shared";
import { ResourceNotFound } from "../../../components/pagePartial";
import { GetSnippetBySlugLive,GetSnippetBySlug } from "../../../actions/snippet";
import notification from "../../../core/services/alert";

class ViewEmailSnippet extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    
  }
  // State
  state = {
    playerHeight: 0,
    loading: true,
    snippet: null,
    id: this.props.match.params.id,
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
  };

  // Utils
  _handleGenerateCode = async () => {
    let res = await GetSnippetBySlug(this.state.id);
      //console.log("view email",res);
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
      notification.error("Failed to get html");
    }
  };

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

              <video ref={this.videoRef} 
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
              />
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
