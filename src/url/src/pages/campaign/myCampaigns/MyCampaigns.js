import React, { Component } from 'react';

import './MyCampaigns.scss';

import { Icon, Button } from '../../../components/html';

class MyCampaigns extends Component {
  render() {
    return (
      <div className='page-my-campaigns'>
        <div className='ui grid'>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
              <div className='head'>
                <h1 className='title'>
                  <Icon icon='project-diagram' size='2.8' /> My Campaigns
                </h1>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column center aligned'>
              <div className='no-campaigns'>
                <div>
                  <Icon icon='star-half-alt' size='9' />
                </div>
                <h1>No Campaigns here</h1>
              </div>

              <div className='ui placeholder segment'>
                <div className='ui two column stackable center aligned grid'>
                  <div className='ui vertical divider'>Or</div>
                  <div className='middle aligned row'>
                    <div className='column'>
                      <div className='ui icon header'>
                        <div>
                          <Icon icon='search' size='2.2' />
                        </div>
                        Start with a template
                      </div>
                      <div className='field'>
                        <div className='ui search'>
                          <div className='ui icon input'>
                            <input
                              className='prompt'
                              type='text'
                              placeholder='Search templates...'
                            />
                            <i className='search icon' />
                          </div>
                          <div className='results'></div>
                        </div>
                      </div>
                      <br />
                      <Button
                        basic={true}
                        title='Upload'
                        icon='cloud-upload-alt'
                      />
                    </div>
                    <div className='column'>
                      <div className='ui icon header'>
                        <div>
                          <Icon icon='file-code' size='2.2' />
                        </div>
                        Start empty
                      </div>
                      <Button category='brand' title='Create' icon='plus' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { MyCampaigns };
