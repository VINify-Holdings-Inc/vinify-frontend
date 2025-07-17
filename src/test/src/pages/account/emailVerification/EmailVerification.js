import React from 'react';

import './EmailVerification.scss';

import history from '../../../history';
import { Button } from '../../../components/html';

import { VerifyEmailAction } from '../../../actions/account';

class EmailVerification extends React.Component {
  // State
  state = {
    token: history.location.search.split('?')[1],
    loading: true,
    responseText: 'Congratulations!',
    helpText: 'Your account has been verified.',
    count: 4
  };

  // LifeCycle Events

  componentDidMount = async () => {
    await this.emailVerification();

    this.setCounter = setInterval(() => {
      this.updateCount();
    }, 1000);
  };

  //Events

  _onClickGoToPortal = () => {
    window.location.href = '/signin';
  };

  //Utils

  updateCount = () => {
    if (this.state.count != 0) {
      this.setState(prevState => {
        return { count: prevState.count - 1 };
      });
    } else {
      clearInterval(this.setCounter);
      window.location.href = '/signin';
    }
  };

  emailVerification = async () => {
    let response = await VerifyEmailAction(this.state.token);
    if (response.result) {
      this.setState({
        loading: false
      });
    } else {
      this.setState({
        loading: false,
        responseText: 'Sorry!',
        helpText: response.body
      });
    }
  };

  render() {
    return (
      <div className='page-email-verification'>
        <div className='ui grid'>
          <div className='sixteen wide column'>
            {this.state.loading ? (
              <div className='head'>
                <h2>Please Wait!</h2>
                <p>We are processing your request.</p>
              </div>
            ) : (
              <div>
                <div className='head'>
                  <h2>{this.state.responseText}</h2>
                  <p>{this.state.helpText}</p>
                </div>
                <div className='ui grid'>
                  <div className='centered three wide computer five wide tablet seven wide mobile column'>
                    <Button
                      fluid={true}
                      category={'base'}
                      onClick={this._onClickGoToPortal}
                      title='Go to platform'
                    />
                  </div>
                </div>
                <p className='pt-3'>
                  You'll be redirected automatically in {this.state.count}s
                </p>
              </div>
            )}
            <div className='foot'>
              <p>
                &copy;2019 All Rights Reserved.
                <br />
                Read our <a>Terms</a>, <a>Privacy Policy</a> and
                <a>Cookie Policy</a>.
              </p>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { EmailVerification };
