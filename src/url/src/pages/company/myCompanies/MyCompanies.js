import React, { Component } from 'react';

import { Icon, Button } from '../../../components/html';

import './MyCompanies.scss';

class MyCompanies extends Component {
  //Events

  _onClickTab = ev => {
    this.toggleTabs(ev.target.id);
  };

  //Utils

  toggleTabs = tabId => {
    let id = parseInt(tabId.match(/\d+/g), 10);
    let tabs = document.getElementsByClassName('tab-item');

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
    }

    document.getElementById(`tab${id}`).classList.add('active');
    document.getElementById(`tabPane${id}`).classList.add('active');
  };

  render() {
    return (
      <div className='page-my-companies'>
        <div className='ui grid'>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
              <div className='head'>
                <h1 className='title'>
                  <Icon icon='puzzle-piece' size='2.8' /> My Companies
                </h1>
                <Button title='New Company' icon='plus' />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
              <div className='ui pointing secondary menu'>
                <a
                  className='active item tab-item'
                  id='tab1'
                  onClick={this._onClickTab}>
                  Owned Companies
                </a>
                <a
                  className='item tab-item'
                  id='tab2'
                  onClick={this._onClickTab}>
                  Companies I've Joined
                </a>
              </div>
              <div className='ui segment active tab tab-item' id='tabPane1'>
                Coming soon...
              </div>
              <div className='ui segment tab tab-item' id='tabPane2'>
                Coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { MyCompanies };
