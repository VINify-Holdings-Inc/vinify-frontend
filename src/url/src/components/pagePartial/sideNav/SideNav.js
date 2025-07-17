import React, {Component} from 'react';
import {connect} from 'react-redux';
import history from '../../../history';

import {ButtonLink} from "../../html/buttonLink/ButtonLink";
import alert from '../../../core/services/alert';
import {SignOutAction} from '../../../actions/account';

class SideNav extends Component {
    constructor(props){
        super(props)
        this.state = {
            showMenu: false,
            showProfileOptions: false,
        }

        this.menuShowToggle = this.menuShowToggle.bind(this);
        this.profileShowToggle = this.profileShowToggle.bind(this);
    }

    menuShowToggle = () => {
        this.setState({showMenu: !this.state.showMenu})
    }

    profileShowToggle = () => {
        this.setState({showProfileOptions: !this.state.showProfileOptions})
    }

    profileHide = () => {
        this.setState({showProfileOptions: false})
    }

    // Events

    _onClickSignOut = async () => {
        await this.signOut();
    };

    // Utils

    signOut = async () => {
        let response = await SignOutAction();
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
            <>
                <div id='mobile-menu' className={ this.state.showMenu ? 'showMenu': 'hideMenu' + ' hidden relative z-40 md:hidden'} role="dialog" aria-modal="true">
                    <div onClick={this.menuShowToggle} className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50"></div>

                    <div className="fixed inset-0 flex z-50 border-l-4 border-primary">
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-light-rose">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    onClick={this.menuShowToggle}
                                    type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Close sidebar</span>
                                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <a href={this.props.sitemap.routes.home.path}>
                                        <img className="h-14 w-auto"
                                             src={require(`../../../content/img/brand/logo.png`)}
                                             alt="EyeMail Inc."/>
                                    </a>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">
                                    <a href={this.props.sitemap.routes.home.path}
                                       className={
                                           this.props.route.module == this.props.sitemap.modules.home
                                               ? 'text-light-rose-menu bg-light-rose-hover group flex items-center px-2 py-2 text-base font-bold rounded-md'
                                               : 'text-light-rose-dark group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                       }>
                                        <svg className={
                                            this.props.route.module == this.props.sitemap.modules.home
                                                ? 'text-light-rose-menu mr-4 flex-shrink-0 h-6 w-6'
                                                : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-4 flex-shrink-0 h-6 w-6'
                                        }
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                                             aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Home
                                    </a>

                                    <a href={this.props.sitemap.routes.mySnippets.path}
                                       className={
                                           this.props.route.module == this.props.sitemap.modules.eyemail
                                               ? 'text-light-rose-menu bg-light-rose-hover group flex items-center px-2 py-2 text-base font-bold rounded-md'
                                               : 'text-light-rose-dark group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                       }>
                                        <svg
                                            className={
                                                this.props.route.module == this.props.sitemap.modules.eyemail
                                                    ? 'text-light-rose-menu mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                                    : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                            }
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
                                        </svg>
                                        My EyeMails
                                    </a>

                                    <a href={this.props.sitemap.routes.reportsWithoutId.path}
                                       className={
                                           this.props.route.module == this.props.sitemap.modules.report
                                               ? 'text-light-rose-menu bg-light-rose-hover group flex items-center px-2 py-2 text-base font-bold rounded-md'
                                               : 'text-light-rose-dark group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                       }>
                                        <svg
                                            className={
                                                this.props.route.module == this.props.sitemap.modules.report
                                                    ? 'text-light-rose-menu mr-4 flex-shrink-0 h-6 w-6'
                                                    : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-4 flex-shrink-0 h-6 w-6'
                                            }
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                        Reports
                                    </a>

                                    <a href={this.props.sitemap.routes.productLines.path}
                                       className={
                                           this.props.route.module == this.props.sitemap.modules.productLines
                                               ? 'text-light-rose-menu bg-light-rose-hover group flex items-center px-2 py-2 text-base font-bold rounded-md'
                                               : 'text-light-rose-dark group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                       }>
                                        <svg
                                            className={
                                                this.props.route.module == this.props.sitemap.modules.productLines
                                                    ? 'text-light-rose-menu mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                                    : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                            }
                                            width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd"
                                            clipRule="evenodd">
                                            <path
                                                d="M12.484 24v-5.991l2.224 2.352 4.042-2.12v2.416l-6.266 3.343zm-1-.003l-6.26-3.34v-2.465l4.088 2.245 2.172-2.385v5.945zm-3.7-15.313c.639.777 1.27 1.934 1.459 3.18l-3.208 1.77 5.449 2.891v.042l-2.381 2.614-4.599-2.525-.001.001-1.533-.883 2.254-2.481-2.254-2.121 4.814-2.488zm8.431.031l4.789 2.499-2.255 2.078.001.001 2.254 2.59-1.604.888-4.485 2.353-2.431-2.571v-.003l5.457-2.916-3.169-1.748c.194-1.321.695-2.266 1.443-3.171zm-3.967 5.285h-.521c-.137 0-.269-.046-.359-.127l-.693-.456h2.625l-.693.456c-.09.081-.221.127-.359.127zm1.077-1.167h-2.659c-.161 0-.292-.13-.292-.291 0-.161.131-.292.292-.292h2.659c.161 0 .291.131.291.292 0 .161-.13.291-.291.291zm.288-1.166h-3.251c0-2.304-1.874-3.301-1.874-5.383 0-2.172 1.748-3.367 3.498-3.367 1.75 0 3.502 1.197 3.502 3.367 0 2.082-1.875 3.047-1.875 5.383zm-6.267-5.334h-1.775v-1h1.821c-.039.22-.06.446-.06.676l.014.324zm11.058 0h-1.763l.013-.324c0-.23-.02-.456-.059-.676h1.809v1zm-9.998-3.02c-.227.248-.424.52-.584.811l-1.441-1.023.579-.815 1.446 1.027zm7.17-.005l1.439-1.022.579.815-1.432 1.018c-.161-.291-.359-.563-.586-.811zm-5.307-1.223c-.319.115-.621.261-.901.435l-.773-1.58.898-.44.776 1.585zm3.439-.004l.774-1.581.898.44-.77 1.574c-.281-.172-.583-.318-.902-.433zm-1.22-.272c-.163-.015-.328-.023-.495-.023-.171 0-.339.008-.505.024v-1.81h1v1.809z"/>
                                        </svg>
                                        Product Lines
                                    </a>

                                    <a href={this.props.sitemap.routes.supportCenter.path}
                                       className={
                                           this.props.route.module == this.props.sitemap.modules.support
                                               ? 'text-light-rose-menu bg-light-rose-hover group flex items-center px-2 py-2 text-base font-bold rounded-md'
                                               : 'text-light-rose-dark group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                       }>
                                        <svg
                                            className={
                                                this.props.route.module == this.props.sitemap.modules.support
                                                    ? 'text-light-rose-menu mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                                    : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-4 flex-shrink-0 h-6 w-6 fill-current'
                                            }
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path
                                                d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm1.024 13.975c0 .566-.458 1.025-1.024 1.025-.565 0-1.024-.459-1.024-1.025 0-.565.459-1.024 1.024-1.024.566 0 1.024.459 1.024 1.024zm1.141-8.192c-.498-.505-1.241-.783-2.09-.783-1.786 0-2.941 1.271-2.941 3.237h1.647c0-1.217.68-1.649 1.261-1.649.519 0 1.07.345 1.117 1.004.052.694-.319 1.046-.788 1.493-1.157 1.1-1.179 1.633-1.173 2.842h1.643c-.01-.544.025-.986.766-1.785.555-.598 1.245-1.342 1.259-2.477.008-.758-.233-1.409-.701-1.882z"/>
                                        </svg>
                                        Support
                                    </a>
                                </nav>
                            </div>

                            <button onClick={this.profileShowToggle}
                                    className="flex-shrink-0 flex justify-center border-t border-gray-200 p-4 relative">
                                <div className="flex items-center justify-center space-x-4">
                                    <div className='flex items-center'>
                                        <img className="inline-block h-9 w-9 rounded-full"
                                             src={ this.props.user.profilePictureId
                                                 ? 'https://staging-assets-dev.s3.us-east-2.amazonaws.com/' + this.props.user.profilePictureId
                                                 : require(`../../../content/img/default-img.png`)}
                                             alt=""/>

                                        <div className='ml-2'>
                                            <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{this.getShortUserName()}</p>
                                        </div>
                                    </div>

                                    <div className="ml-3 flex justify-between items-center">
                                        <svg className='h-4 w-4 fill-current text-light-rose-dark'
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="24" height="24" viewBox="0 0 24 24">
                                            <path
                                                d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/>
                                        </svg>
                                    </div>

                                    <div className={this.state.showProfileOptions
                                        ? 'absolute right-20 -top-24 z-50 w-40 origin-top-right text-left rounded-md bg-light-rose shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                        : 'hidden'}
                                         role="menu" aria-orientation="vertical" aria-labelledby="menu-0-button"
                                         tabIndex="-1">
                                        <div role="none">
                                            <a href={this.props.sitemap.routes.settings.path}
                                               className="block px-4 py-3 text-base font-normal text-light-rose-dark hover:text-light-rose-menu-text hover:bg-light-rose-hover transition duration-150 rounded-md"
                                               role="menuitem" tabIndex="-1"
                                               id="menu-0-item-0"> Your Profile </a>

                                            <div onClick={this._onClickSignOut}
                                                 className="block px-4 py-3 text-base text-light-rose-dark hover:text-light-rose-menu-text hover:bg-light-rose-hover transition duration-150 rounded-md"
                                                 role="menuitem">Sign out
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div onClick={this.menuShowToggle} className="flex-shrink-0 w-14"></div>
                    </div>
                </div>

                <div className="sticky top-0 z-40 md:hidden pl-1 sm:pl-3 sm:pt-3 bg-light-rose border-b-4 border-primary flex items-center justify-between py-3 px-4">
                    <a href={this.props.sitemap.routes.home.path}>
                        <img className="h-14 w-auto px-5"
                             src={require(`../../../content/img/brand/logo.png`)}
                             alt="EyeMail Inc."/>
                    </a>

                    <button type="button" onClick={this.menuShowToggle}
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth="2"
                             stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>

                {/*Static sidebar for desktop*/}
                <div className={'hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'}>
                    <div className="flex-1 flex flex-col min-h-0 border-l-8 border-primary bg-light-rose">
                        <div onClick={this.profileHide} className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <div className='mx-auto'>
                                    <a href={this.props.sitemap.routes.home.path}>
                                        <img className="h-14 w-auto mb-6"
                                             src={require(`../../../content/img/brand/logo.png`)} alt="EyeMail Inc."/>
                                    </a>

                                    <ButtonLink href='/create-eyemail' text='New EyeMail' size="small" addIcon='true'/>
                                </div>
                            </div>

                            <nav className="mt-8 flex-1 px-4 bg-light-rose space-y-2">
                                <a href={this.props.sitemap.routes.home.path}
                                   className={
                                       this.props.route.module == this.props.sitemap.modules.home
                                           ? 'bg-light-rose-hover text-light-rose-menu-text font-bold group flex items-center px-2 py-2 text-base rounded-md'
                                           : 'font-medium text-light-rose-dark hover:bg-light-rose-hover group flex items-center px-2 py-2 text-base rounded-md'
                                   }>
                                    <svg className={
                                        this.props.route.module == this.props.sitemap.modules.home
                                            ? 'text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6'
                                            : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6'
                                    }
                                         xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                                         aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                    </svg>
                                    Home
                                </a>

                                <a href={this.props.sitemap.routes.mySnippets.path}
                                   className={
                                       this.props.route.module == this.props.sitemap.modules.eyemail
                                           ? 'bg-light-rose-hover text-light-rose-menu-text font-bold group flex items-center px-2 py-2 text-base rounded-md'
                                           : 'font-medium hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md'
                                   }
                                >
                                    <svg
                                        className={
                                            this.props.route.module == this.props.sitemap.modules.eyemail
                                                ? 'text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6 fill-current'
                                                : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6 fill-current'
                                        }
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
                                    </svg>
                                    My EyeMails
                                </a>

                                <a href={this.props.sitemap.routes.reportsWithoutId.path}
                                   className={
                                       this.props.route.module == this.props.sitemap.modules.report
                                           ? 'bg-light-rose-hover text-light-rose-menu-text font-bold group flex items-center px-2 py-2 text-base rounded-md'
                                           : 'font-medium hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md'
                                   }>
                                    <svg
                                        className={
                                            this.props.route.module == this.props.sitemap.modules.report
                                                ? 'text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6'
                                                : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6'
                                        }
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                    </svg>
                                    Reports
                                </a>

                                <a href={this.props.sitemap.routes.productLines.path}
                                   className={
                                       this.props.route.module == this.props.sitemap.modules.productLines
                                           ? 'bg-light-rose-hover text-light-rose-menu-text font-bold group flex items-center px-2 py-2 text-base rounded-md'
                                           : 'font-medium hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md'
                                   }>
                                    <svg
                                        className={
                                            this.props.route.module == this.props.sitemap.modules.productLines
                                                ? 'text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6'
                                                : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6 fill-current'
                                        }
                                        width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd"
                                        clipRule="evenodd">
                                        <path
                                            d="M12.484 24v-5.991l2.224 2.352 4.042-2.12v2.416l-6.266 3.343zm-1-.003l-6.26-3.34v-2.465l4.088 2.245 2.172-2.385v5.945zm-3.7-15.313c.639.777 1.27 1.934 1.459 3.18l-3.208 1.77 5.449 2.891v.042l-2.381 2.614-4.599-2.525-.001.001-1.533-.883 2.254-2.481-2.254-2.121 4.814-2.488zm8.431.031l4.789 2.499-2.255 2.078.001.001 2.254 2.59-1.604.888-4.485 2.353-2.431-2.571v-.003l5.457-2.916-3.169-1.748c.194-1.321.695-2.266 1.443-3.171zm-3.967 5.285h-.521c-.137 0-.269-.046-.359-.127l-.693-.456h2.625l-.693.456c-.09.081-.221.127-.359.127zm1.077-1.167h-2.659c-.161 0-.292-.13-.292-.291 0-.161.131-.292.292-.292h2.659c.161 0 .291.131.291.292 0 .161-.13.291-.291.291zm.288-1.166h-3.251c0-2.304-1.874-3.301-1.874-5.383 0-2.172 1.748-3.367 3.498-3.367 1.75 0 3.502 1.197 3.502 3.367 0 2.082-1.875 3.047-1.875 5.383zm-6.267-5.334h-1.775v-1h1.821c-.039.22-.06.446-.06.676l.014.324zm11.058 0h-1.763l.013-.324c0-.23-.02-.456-.059-.676h1.809v1zm-9.998-3.02c-.227.248-.424.52-.584.811l-1.441-1.023.579-.815 1.446 1.027zm7.17-.005l1.439-1.022.579.815-1.432 1.018c-.161-.291-.359-.563-.586-.811zm-5.307-1.223c-.319.115-.621.261-.901.435l-.773-1.58.898-.44.776 1.585zm3.439-.004l.774-1.581.898.44-.77 1.574c-.281-.172-.583-.318-.902-.433zm-1.22-.272c-.163-.015-.328-.023-.495-.023-.171 0-.339.008-.505.024v-1.81h1v1.809z"/>
                                    </svg>
                                    Product Lines
                                </a>

                                <a href={this.props.sitemap.routes.supportCenter.path}
                                   className={
                                       this.props.route.module == this.props.sitemap.modules.support
                                           ? 'bg-light-rose-hover text-light-rose-menu-text font-bold group flex items-center px-2 py-2 text-base rounded-md'
                                           : 'font-medium hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md'
                                   }>
                                    <svg
                                        className={
                                            this.props.route.module == this.props.sitemap.modules.support
                                                ? 'text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6'
                                                : 'text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6 fill-current'
                                        }
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path
                                            d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm1.024 13.975c0 .566-.458 1.025-1.024 1.025-.565 0-1.024-.459-1.024-1.025 0-.565.459-1.024 1.024-1.024.566 0 1.024.459 1.024 1.024zm1.141-8.192c-.498-.505-1.241-.783-2.09-.783-1.786 0-2.941 1.271-2.941 3.237h1.647c0-1.217.68-1.649 1.261-1.649.519 0 1.07.345 1.117 1.004.052.694-.319 1.046-.788 1.493-1.157 1.1-1.179 1.633-1.173 2.842h1.643c-.01-.544.025-.986.766-1.785.555-.598 1.245-1.342 1.259-2.477.008-.758-.233-1.409-.701-1.882z"/>
                                    </svg>
                                    Support
                                </a>
                            </nav>
                        </div>
                        <button onClick={this.profileShowToggle} className="flex-shrink-0 flex justify-center border-t border-gray-200 p-4 relative">
                            <div className="flex items-center justify-center space-x-4">
                                <div className='flex items-center'>
                                    <img className="inline-block h-9 w-9 rounded-full"
                                         src={ this.props.user.profilePictureId
                                             ? 'https://staging-assets-dev.s3.us-east-2.amazonaws.com/' + this.props.user.profilePictureId
                                             : require(`../../../content/img/default-img.png`)}
                                         alt=""/>

                                    <div className='ml-2'>
                                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{this.getShortUserName()}</p>
                                    </div>
                                </div>

                                <div className="ml-3 flex justify-between items-center">
                                    <svg className='h-4 w-4 fill-current text-light-rose-dark'
                                         xmlns="http://www.w3.org/2000/svg"
                                         width="24" height="24" viewBox="0 0 24 24">
                                        <path
                                            d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/>
                                    </svg>
                                </div>

                                <div className={this.state.showProfileOptions
                                    ? 'absolute left-8 -top-24 z-50 w-40 origin-top-right text-left rounded-md bg-light-rose shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                    : 'hidden'}
                                     role="menu" aria-orientation="vertical" aria-labelledby="menu-0-button"
                                     tabIndex="-1">
                                    <div role="none">
                                        <a href={this.props.sitemap.routes.settings.path}
                                           className="block px-4 py-3 text-base font-normal text-light-rose-dark hover:text-light-rose-menu-text hover:bg-light-rose-hover transition duration-150 rounded-md"
                                           role="menuitem" tabIndex="-1"
                                           id="menu-0-item-0"> Your Profile </a>

                                        <div onClick={this._onClickSignOut}
                                           className="block px-4 py-3 text-base text-light-rose-dark hover:text-light-rose-menu-text hover:bg-light-rose-hover transition duration-150 rounded-md"
                                           role="menuitem">Sign out</div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

SideNav.defaultProps = {
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
)(SideNav);
export {connectedComponent as SideNav};
