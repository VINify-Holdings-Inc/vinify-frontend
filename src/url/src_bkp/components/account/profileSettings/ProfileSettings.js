import React, {Component} from 'react';
import {connect} from 'react-redux';

import './ProfileSettings.scss';

import {Loading} from '../../shared';
import {GeneralSettings, PasswordSettings, ProfilePictureSetting} from '../';

import {GetProfile} from '../../../actions/user';
import {ChangeProfile} from '../../../actions/system';

class ProfileSettings extends Component {
    //State

    state = {
        loading: true
    };

    // LifeCycle Events

    componentDidMount = async () => {
        await this.getProfile();
        this.setState({
            loading: false
        });
    };

    //Events

    _onClickUploadPhoto = ev => {
        this.fileUpload(ev.target.files);
    };

    //Utils

    getProfile = async () => {
        let res = await GetProfile();
        if (res.result) {
            this.props.ChangeProfile(res.body);
        }
    };

    //Render

    render() {
        return this.state.loading ? (
            <div className='ui center aligned grid'>
                <Loading/>
            </div>
        ) : (
            <div>
                <div className='flex flex-col md:flex-row gap-x-16 justify-between'>
                    <div className='md:w-8/12 flex flex-col md:flex-row justify-between'>
                        <GeneralSettings {...this.props.profile} />
                    </div>

                    <div className='md:w-4/12'>
                        <ProfilePictureSetting
                            profilePictureUrl={this.props.profile.profilePictureUrl}
                        />
                    </div>
                </div>

                <PasswordSettings/>
                
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.UserReducer.User,
        profile: state.UserReducer.Profile
    };
}

const connectedComponent = connect(
    mapStateToProps,
    {ChangeProfile}
)(ProfileSettings);

export {connectedComponent as ProfileSettings};
