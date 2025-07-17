import React, {Component} from 'react';
import {connect} from 'react-redux';

import './Home.scss';

import history from '../../../history';
import {WelcomePopup} from '../../../components/app';
import {ButtonLink} from "../../../components/html/buttonLink/ButtonLink";

// Todo: Make two components out of this snippet one
import {MySnippets} from "../../snippet";


class Home extends Component {

    state = {
        isNewUser: false
    }

    // LifeCycle Events
    componentDidMount = async () => { //console.log("this is home",this.props.user.fullName);
        const isNewUser = new URLSearchParams(this.props.location.search).get('new') !== null;
        if (isNewUser) {
            setTimeout(() => {
                this.setState({
                    isNewUser: true
                });
            }, 800)
        }
    };

    // Events

    _onDismissWelcomePopup = () => {
        const queryParams = new URLSearchParams(this.props.location.search);
        queryParams.delete('new');
        history.replace({
            search: queryParams.toString(),
        });
        this.setState({
            isNewUser: false
        })
    }

    //Utils

    getDisplayName = () => this.props.user.fullName.split(' ')[0];

    //Render

    render() {
        return (
            <div>
                {
                    this.state.isNewUser &&
                    <WelcomePopup displayName={this.getDisplayName()} onDismiss={this._onDismissWelcomePopup}/>
                }

                <div>
                    <h1 className='text-2xl font-bold mb-0'>Hello, {this.getDisplayName()}!</h1>
                    <p className='mt-1'>Welcome to the EyeMail Dashboard.</p>
                </div>

                <div className='mt-6'>
                    <h2 className='text-xl font-bold mb-0'>Getting Started</h2>
                    <p className='mt-1'>Let’s upload, encode and compress your video, to create some EyeMail Magic
                        special
                        for you.</p>

                    <div
                        className="my-8 bg-light-gray px-5 py-20 rounded border border-gray-200 flex items-center justify-center">
                        <div>
                            <svg className='mb-6 block mx-auto' xmlns="http://www.w3.org/2000/svg" width="40"
                                 height="40"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M24 1l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-13 8.63c1.013-1.574 1.955-2.256 2.938-2.55l.234 1.448c-.663.256-1.215.806-1.965 1.971l-1.207-.869zm11-4.729c-.928 1.473-1.748 2.104-2.566 2.322l.254 1.436c.746-.176 1.521-.583 2.312-1.391v-2.367zm-3.855 2.385c-.883-.103-1.92-.365-2.938-.376l.236 1.462c.873.068 1.931.345 2.963.395l-.261-1.481z"/>
                            </svg>

                            <ButtonLink href={this.props.sitemap.routes.createSnippet.path} text='Create your EyeMail'/>
                        </div>
                    </div>

                    <MySnippets show='4'/>
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
)(Home);
export {connectedComponent as Home};
