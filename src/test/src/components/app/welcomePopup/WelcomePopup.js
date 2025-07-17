import React, { Component } from "react";
import { Modal, Transition } from "semantic-ui-react";

import "./../../../content/theme/semantic.css";

import sitemap from "../../../sitemap";
import { Button } from "../../html";
import video from "./../../../content/video/welcome.mp4";
import poster from "./../../../content/img/welcome.jpg";
import history from "../../../history";

class WelcomePopup extends Component {
  state = {
    watchVideo: false,
  };

  _onWatchVideo = () => {
    this.setState({
      watchVideo: !this.state.watchVideo,
    });
  };

  render() {
    return (
      <Transition visible={true} animation="scale" duration={700}>
        <Modal
          dimmer={"blurring"}
          open={true}
          onClose={this.props.onDismiss}
          closeOnDimmerClick={false}
        >
          <Modal.Content>
            {!this.state.watchVideo && (
              <div>
                <h1>🎉 Welcome {this.props.displayName}!</h1>
                <h4>We're glad to have you onboard.</h4>
                <p>
                  Our online Dashboard system allows you to generate compressed
                  video emails and compelling campaigns.
                </p>
                <h5>Below are some options to get started quickly.</h5>
              </div>
            )}

            {this.state.watchVideo && (
              <div className="video">
                <video
                  controls
                  poster={poster}
                  className="w-full"
                  muted={true}
                  autoPlay={true}
                  playsInline={true}
                  src={video}
                />
              </div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              inline={true}
              transparent={true}
              title={"Skip"}
              onClick={this.props.onDismiss}
            />
            {!this.state.watchVideo && (
              <Button
                inline={true}
                basic={true}
                iconType={"solid"}
                icon={"play-circle"}
                title={"Watch Video"}
                onClick={this._onWatchVideo}
              />
            )}
            {this.state.watchVideo && (
              <Button
                inline={true}
                basic={true}
                iconType={"solid"}
                title={"Back"}
                onClick={this._onWatchVideo}
              />
            )}
            <Button
              link={sitemap.routes.createSnippet.path}
              inline={true}
              className="brand"
              iconType={"solid"}
              icon={"code"}
              title={"Create EyeMail"}
            />
          </Modal.Actions>
        </Modal>
      </Transition>
    );
  }
}

export { WelcomePopup };
