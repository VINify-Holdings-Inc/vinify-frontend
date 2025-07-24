import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import history from '../../../history';
import { SideNav, Footer, Breadcrumb } from '..';
import { ChangeActiveRoute, ChangeUser } from '../../../actions/system';
import { TryLogInAction } from '../../../actions/account';
import Config from '../../../core/config/';
var config;

class Layout extends Component {
  // State
  state = {
    isAuthenticated: false,
    loading: true
  };

  breadcrumbProps = {
    module: this.props.module,
    page: {
      name: this.props.title,
      url: this.props.path,
      isIndex: this.props.isIndex || false
    }
  };

  // LifeCycle Events

  componentDidMount = async () => {
    config = await Config();
    this.changeTitle(this.props);
    await this.tryLogIn();
  };

  componentWillReceiveProps = async props => {
   // this.setState({ loading: true });
    this.changeTitle(props);
    await this.tryLogIn();
  };

  // Utils

  tryLogIn = async () => {
    let response = await TryLogInAction();
    if(response?.body.emailAddress=="mom@eyemailinc.com"){
      history.push('/admin-dashboard')
    }
    if (response.result) {
      this.props.changeUser(response.body);
    }
    this.setState({
      isAuthenticated: response.result,
      loading: false
    });
 

    this.props.changeActiveRoute({
      exact: this.props.exact,
      module: this.props.module,
      path: this.props.path,
      title: this.props.title,
      requireAuth: this.props.requireAuth,
      isHidden: this.props.isHidden,
      container: this.props.container
    });
  };

  changeTitle = props => {
    if (props.title === '') {
      document.title = config.title;
    } else {
      document.title = `${props.title} ${
        props.module.isHome || props.isIndex ? '' : ` - ${props.module.name}`
      } | ${config.title}`;
    }
  };

  render() {
    return this.state.loading ? null : this.props.requireAuth ? (
      this.state.isAuthenticated === true ? (
          <div className='h-full'>
            <SideNav isLoggedIn={this.state.isAuthenticated} />

            <div className="md:pl-64 flex flex-col flex-1">
              <div className="flex-1">
                <div className="pt-8 pb-5">
                  <div className="container mx-auto px-4 sm:px-6 md:px-10">
                    {/*<Breadcrumb {...this.breadcrumbProps} />*/}
                    <Route {...this.props} />
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
      ) : this.props.isHidden ? (
        <div className='h-full'>
          <Route {...this.props} />
        </div>
      ) : (
        <Redirect to='/signin' />
      )
    ) : this.props.isPublic ? (
        <div className='h-full'>
          <SideNav isLoggedIn={this.state.isAuthenticated} />

          <div className="md:pl-64 flex flex-col flex-1">
            <div className="flex-1">
              <div className="pt-8 pb-5">
                <div className="container mx-auto px-4 sm:px-6 md:px-24">
                  <Breadcrumb {...this.breadcrumbProps} />
                  <Route {...this.props} />
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
    ) : this.props.isHidden ? (
      this.state.isAuthenticated === false ? (
        <div className='h-full'>
          <Route {...this.props} />
        </div>
      ) : (
        <Redirect to='/' />
      )
    ) : (
      <div className='h-full'>
        <Route {...this.props} />
      </div>
    );
  }
}

Layout.defaultProps = {
  requireAuth: true, // Route requires to be logged in /eyemails
  isPublic: false, // Route can be visited as logged in or logged out: i.e. /tour
  isHidden: false, // Route can only be visited as logged out: i.e. /forgotpassword, /resetpassword
  container: false,
  title: ''
};

const mapDispatchToProps = dispatch => {
  return {
    changeActiveRoute: route => {
      dispatch(ChangeActiveRoute(route));
    },
    changeUser: user => {
      dispatch(ChangeUser(user));
    }
  };
};

const connectedComponent = connect(
  null,
  mapDispatchToProps
)(Layout);

export { connectedComponent as Layout };
