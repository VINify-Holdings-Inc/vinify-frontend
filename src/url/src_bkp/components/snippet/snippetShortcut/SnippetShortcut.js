import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SnippetShortcut.scss';
import { Button, Icon } from '../../html';

class SnippetShortcut extends Component {
  render() {
    return (
      <div className='cmp-snippet-shortcut'>
        <div className='ui center aligned grid'>
          <div className='row'>
            <div className='eight wide computer fourteen wide tablet sixteen wide mobile column'>
              <div className='ui placeholder segment'>
                <div className='ui icon header'>
                  <div className='segment-header'>
                    <img className='ui image' src={require('../../../content/img/code.png')} />
                  </div>
                  Lorem ipsum dolor
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore.
                </p>
                <Button
                  category={'brand'}
                  size={'small'}
                  title='Create a new one'
                  link={this.props.sitemap.routes.createSnippet.path}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.UserReducer.User,
    sitemap: state.FlagReducer.Sitemap
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SnippetShortcut);

export { connectedComponent as SnippetShortcut };
