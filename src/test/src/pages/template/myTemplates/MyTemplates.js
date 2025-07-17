import React, { Component } from 'react';

import './MyTemplates.scss';

import { Icon, Button } from '../../../components/html';

class MyTemplates extends Component {
  render() {
    return (
      <div className='page-my-templates'>
        <div className='ui grid'>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
              <div className='head'>
                <h1 className='title'>
                  <Icon icon='envelope-open-text' size='2.8' /> Templates
                </h1>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column center aligned'>
              <div className='no-templates'>
                <div>
                  <Icon icon='file-code' size='9' />
                </div>
                <h1>No saved templates yet</h1>
                <p>Templates are saved html designs that can be used when creating email campaigns.</p>
                <Button title='Upload' icon='file-upload' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { MyTemplates };
