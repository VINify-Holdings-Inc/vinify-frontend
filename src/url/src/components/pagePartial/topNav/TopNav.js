import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../history';
import $ from 'jquery';

import { Icon } from '../../html';
import alert from '../../../core/services/alert';
import { SignOutAction } from '../../../actions/account';

import './TopNav.scss';

class TopNav extends Component {

    // Events

    componentDidMount = () => {
        $(document).on('click', function (e) {
            let target = $(e.target);
            if (target.hasClass('sidenav-toggle') || target.parent().hasClass('sidenav-toggle') || target.parent().parent().hasClass('sidenav-toggle')) {
                $('.side-nav').toggleClass('mobile-reveal');
            }
            else if ($('.side-nav').has(target).length < 1) {
                $('.side-nav').removeClass('mobile-reveal');
            }
        });
    }

    _onClickSignOut = async () => {
        await this.signOut();
    };

    // Utils

    signOut = async () => {
        let response = await SignOutAction();
       // console.log("signOut",response);
        if (response.result) {
            history.replace(this.props.sitemap.routes.signIn);
           // window.location.reload();
        } else {
            alert.error('Unable to sign out');
        }
    };

    getShortUserName = () => {
        const name = this.props.user.fullName.split(' ');
        const firstname =
            name[0].length > 12 ? name[0].substring(0, 11) + '.' : name[0];
        return name.length > 1 && name[0].length <= 12
            ? firstname + ' ' + name[1].charAt(0) + '.'
            : firstname;
    };

    render() {
        return (
            <nav className='top-nav'>
                <div className='top-nav-container'>
                    <div className='brand'>
                        <img
                            src={require(`../../../content/img/brand/logo.png`)}
                            id='logo'
                            alt='EyeMail Inc.'
                            title='EyeMail Inc.'
                        />
                    </div>
                    <div className="top-nav-menu left">
                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.home.path;
                        }}
                            className={
                                this.props.route.module == this.props.sitemap.modules.home
                                    ? 'active'
                                    : ''
                            }>Home</div>

                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.mySnippets.path;
                        }} className={
                            this.props.route.module == this.props.sitemap.modules.eyemail
                                ? 'active'
                                : ''
                        }>EyeMails</div>
                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.reportsWithoutId.path;
                        }} className={
                            this.props.route.module == this.props.sitemap.modules.report
                                ? 'active'
                                : ''
                        }>Reports</div>
                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.supportCenter.path;
                        }} className={
                            this.props.route.module == this.props.sitemap.modules.support
                                ? 'active'
                                : ''
                        }>Support</div>
                    </div>
                    <div className="top-nav-menu right">
                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.createSnippet.path;
                        }}>
                            <div className="shortcut"><Icon icon='plus' /> New EyeMail</div>
                        </div>
                        <div onClick={() => {
                            window.location.href = this.props.sitemap.routes.settings.path;
                        }}><Icon icon='user' /> {this.getShortUserName()}</div>
                        <div onClick={this._onClickSignOut}><Icon icon='sign-out-alt' /> Logout</div>
                    </div>
                    {/* <div className='sidenav-toggle'>
                        <Icon icon='bars' size={1.5} />
                    </div> */}
                </div>
            </nav>
        )
    }
};

TopNav.defaultProps = {
    isLoggedIn: false
  };
  
  const mapStateToProps = state => {
    return {
      sitemap: state.FlagReducer.Sitemap,
      user: state.UserReducer.User,
      route: state.FlagReducer.ActiveRoute
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {};
  };
  
  const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopNav);
  export { connectedComponent as TopNav };