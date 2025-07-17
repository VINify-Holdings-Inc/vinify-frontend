import React, {Component} from 'react';
import {connect} from 'react-redux';

import './Settings.scss';
import {Icon} from '../../../components/html';
import {Loading} from '../../../components/shared';

import {ProfileSettings, MediaSettings} from '../../../components/account';

class Settings extends Component {
    //State

    state = {
        loading: false,
        userProfile: {
            firstName: '',
            lastName: ''
        },
        userAccount: {
            email: '',
            phoneNumber: ''
        },
        accountSecurity: {
            securityQuestion: '',
            securityAnswer: ''
        }
    };

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
            <div>
                <div>
                    <h1 className='text-2xl font-bold mb-0'>Settings</h1>
                    <p className='mt-1'>Update your account information</p>
                </div>

                <div>
                    <ProfileSettings/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.UserReducer.User
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
export {connectedComponent as Settings};
