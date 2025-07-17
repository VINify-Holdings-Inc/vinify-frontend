import React, { Component } from "react";
import { connect } from "react-redux";

import "./ViewSnippet.scss";

import { Loading } from "../../../components/shared";
import { ResourceNotFound } from "../../../components/pagePartial";
import { SnippetDetails } from "../../../components/snippet";

import { GetSnippet } from "../../../actions/snippet";

class ViewSnippet extends Component {
  // State
  state = {
    loading: true,
    snippet: null,
    id: this.props.match.params.id,
  };

  // LifeCycle Events

  componentDidMount = async () => {
    await this.getSnippet();
  };

  // Utils

  getSnippet = async () => {
    let res = await GetSnippet(this.state.id);
    if (res.result) {
      this.setSnippet(res.body);
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  setSnippet = (snippet) => {
    this.setState({
      snippet: snippet,
    });
  };

  render() {
    return (
      <div className="page-view-snippet">
        {this.state.loading ? (
          <div className="center aligned grid">
            <Loading />
          </div>
        ) : this.state.snippet === null ? (
          <ResourceNotFound title="EyeMail" />
        ) : (
          <>
            <div>
              <div className="row">
                <div className="sixteen wide mobile column">
                  <SnippetDetails
                    snippet={this.state.snippet}
                    setSnippet={this.setSnippet}
                  />
                </div>
              </div>
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

const connectedComponent = connect(mapStateToProps, null)(ViewSnippet);
export { connectedComponent as ViewSnippet };
