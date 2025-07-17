import React, {Component} from 'react';
import {connect} from 'react-redux';

import './GeneralSettings.scss';

import {Loading} from '../../shared';
import {GetCountries} from '../../../actions/country';
import {Button, TextBox, Select, DatePicker} from '../../html';

import notification from '../../../core/services/alert';
import {ChangeProfile} from '../../../actions/system';
import {GetTimezones} from '../../../actions/timezone';
import {UpdateProfile, GetProfile} from '../../../actions/user';
import formValidator from '../../../core/services/formValidator';
import accountValidations from '../../../core/validations/accountValidations';
import Swal from 'sweetalert2'
class GeneralSettings extends Component {
    //State
    constructor(props) {
        super(props);

        this.state = {
            isUpdating: false,
            loading: true,
            profileUpdateForm: {
                firstName: {
                    label: 'First Name',
                    value: this.props.firstName,
                    required: true,
                    id: 'firstName',
                    validator: value => value != '',
                    placeholder: 'First name here',
                    type: 'text',
                    autoFocus: true,
                    errorMessage: 'Please enter your first name!',
                    onChange: event => this._onChange(event),
                    fluid: true,
                    maxLength:90,
                },
                lastName: {
                    label: 'Last Name',
                    value: this.props.lastName !== null ? this.props.lastName : '',
                    id: 'lastName',
                    placeholder: 'Last name here',
                    type: 'text',
                    errorMessage: 'Please enter your last name!',
                    onChange: event => this._onChange(event),
                    fluid: true,
                    maxLength:90,
                },
                email: {
                    label: 'Email',
                    value: this.props.email,
                    required: true,
                    validator: email => accountValidations.validateEmail(email),
                    id: 'email',
                    placeholder: 'someone@example.com',
                    errorMessage: 'Invalid email',
                    type: 'email',
                    onChange: event => this._onChange(event),
                    fluid: true
                },
                country: {
                    label: 'Country',
                    options: [],
                    value: this.props.countryId,
                    fluid: true,
                    search: true,
                    selection: true,
                    required: true,
                    id: 'country',
                    name: 'country',
                    validator: value => value != '',
                    placeholder: 'Select Country',
                    errorMessage: 'Invalid country',
                    onChange: event => this._onChange(event)
                },
                timezone: {
                    label: 'Timezone',
                    options: [],
                    value: this.props.timezoneId !== null || this.props.timezoneId !=0 ? this.props.timezoneId : this.state.profileUpdateForm?.timezone?.options[1]?.value,
                    fluid: true,
                    search: true,
                    selection: true,
                    required: true,
                    id: 'timezone',
                    name: 'timezone',
                    validator: value => value != '',
                    placeholder: 'Select Timezone',
                    errorMessage: 'Invalid timezone',
                    onChange: event => this._onChange(event)
                },
                // dateOfBirth: {
                //   label: 'Date Of Birth',
                //   value:
                //     this.props.dateOfBirth !== null
                //       ? this.getFormattedDate(this.props.dateOfBirth)
                //       : '',
                //   fluid: true,
                //   required: false,
                //   id: 'dateOfBirth',
                //   name: 'dateOfBirth',
                //   iconPosition: 'right',
                //   validator: date => accountValidations.validateDate(date),
                //   placeholder: 'DD-MM-YYYY',
                //   errorMessage: 'Invalid date',
                //   onChange: event => this._onChange(event),
                //   maxDate: new Date()
                // }
               
            },
             tier:this.props.tier,
        };
    }

    // LifCycle Events

    componentDidMount = async () => {
        await this.getCountries();
        await this.getTimezones();
        this.setState({
            loading: false
        });
        
        if(this.props.timezoneId == null || this.props.timezoneId == 0){
            let profileUpdateForm = this.state.profileUpdateForm;
                profileUpdateForm.timezone.value = this.state.profileUpdateForm?.timezone?.options[1].value;
            this.setState({
                    profileUpdateForm: profileUpdateForm
            })
          }
         // console.log("dd",this.props)
    };

    // Events

    _onChange = event => {
        let profileUpdateForm = this.state.profileUpdateForm;
        profileUpdateForm[event.target.name].value = event.target.value;
        this.setState({
            profileUpdateForm: profileUpdateForm
        });
    };

    _onClickUpdateInfo = async ev => {
        ev.preventDefault();

        const {isValid, form} = formValidator(this.state.profileUpdateForm);
        this.setState({
            profileUpdateForm: form
        });

        if (isValid) {
            await this.updateProfile();
        }
    };

    // Utils

    updateProfile = async () => {
        this.setState({isUpdating: true});
        let profile = {
            firstName: this.state.profileUpdateForm.firstName.value,
            lastName: this.state.profileUpdateForm.lastName.value,
            email: this.state.profileUpdateForm.email.value,
            country:
                this.state.profileUpdateForm.country.value != '' &&
                this.state.profileUpdateForm.country.value != 0
                    ? parseInt(this.state.profileUpdateForm.country.value)
                    : null,
            timezone:
                this.state.profileUpdateForm.timezone.value != '' &&
                this.state.profileUpdateForm.timezone.value != 0
                    ? this.state.profileUpdateForm.timezone.value
                    : null,
            // dateOfBirth:
            //   this.state.profileUpdateForm.dateOfBirth.value != ''
            //     ? this.getDate(this.state.profileUpdateForm.dateOfBirth.value)
            //     : null
        };
        let res = await UpdateProfile(profile);
        if (res.result) {
            await this.getProfile();
            Swal.fire({
                title: "",
                text: `Profile updated successfully`,
                icon: "success"
              });
          /*  notification.success(
                'Profile updated successfully',
                'profileUpdateSuccess'
            ); */
        } else {
          /*  notification.error(res.message, 'profileUpdateFailed');  */
          Swal.fire({
            title: "",
            text: `Profile updatation unsuccessful`,
            icon: "warning"
          });
        }
       // console.log("res.isUpdating");
        this.setState({isUpdating: false});
    };

    getProfile = async () => {
        let res = await GetProfile();
        if (res.result) {
            
            this.props.ChangeProfile(res.body);
        }
    };

    getCountries = async () => {
        let res = await GetCountries();
        let profileUpdateForm = this.state.profileUpdateForm;
        if (res.result) {
            profileUpdateForm.country.options = res.body.map(country => {
                return {
                    value: country.countryId,
                    text: country.countryName
                };
            });
            profileUpdateForm.country.options.unshift({value: 0, text: '-'});
        }
        this.setState({
            profileUpdateForm: profileUpdateForm
        });
    };

    getTimezones = async () => {
        let res = await GetTimezones();
        let profileUpdateForm = this.state.profileUpdateForm;
        if (res.result) {
            profileUpdateForm.timezone.options = res.body.map(timezone => {
                return {
                    value: timezone.timezoneId,
                    text: timezone.timezoneName
                };
            });
            profileUpdateForm.timezone.options.unshift({value: 0, text: '-'});
        }
        this.setState({
            profileUpdateForm: profileUpdateForm
        });
    };

    getFormattedDate = date => {
        if (date == null) return '';
        else {
            date = date.replace(/\//g, '-');
            date = date.split(/-/);
            let formatedDate = '';
            for (let i = 1; i >= 0; i--) {
                if (date[i] < 10) formatedDate += '0' + date[i] + '-';
                else formatedDate += date[i] + '-';
            }
            formatedDate += date[2];
            return formatedDate;
        }
    };

    getDate(date) {
        date = date.split(/-/);
        let formatedDate = '';
        formatedDate += date[1];
        formatedDate += '/' + date[0];
        formatedDate += '/' + date[2];
        return formatedDate;
    }

    _onChangeUserType = (event) => {  
        let snippetForm = this.state.tier;
        snippetForm = event.target.value;
        this.setState({
            tier: snippetForm,
        });
      };

    //Render

    render() {
        return !this.state.loading ? (
            <div className='w-full mt-6'>
                <h2 className='text-xl font-bold mb-4'>Profile Information</h2>

                <div className='form'>
                    <form noValidate onSubmit={this._onClickUpdateInfo}>
                        <div className='flex flex-col lg:flex-row justify-between gap-y-5 sm:gap-x-10'>
                            <TextBox {...this.state.profileUpdateForm.firstName} className='w-full' />
                            <TextBox {...this.state.profileUpdateForm.lastName} className='w-full' />
                        </div>

                        <div className='flex flex-col lg:flex-row justify-between  gap-y-5 sm:gap-x-10 mt-5 mb-5'>
                            <TextBox {...this.state.profileUpdateForm.email} className='w-full' />
                            <Select {...this.state.profileUpdateForm.country} isFullWidth={true}/>
                        </div>
                         
                           {/* usertype */}
                           <div className='cmp-text-box gap-y-5 sm:gap-x-10 mt-5 mb-2' style={{"fontWeight":"600"}}>Registration Type</div>
                    <div  onChange={this._onChangeUserType} className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4" style={{"marginBottom":"20px"}}>
                       <div className="flex items-center"  >
                          <input
                            id="standard"
                            name="user-type"
                            type="radio"
                            value="standard"
                            checked={this.state.tier=='standard'?true:false}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                            disabled={true}
                          />
                          <label
                            htmlFor="standard"
                            className="ml-2 block text-gray-700 font-bold cursor-pointer flex items-center gap-x-2"
                          ><span>Premium</span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="enterprise"
                            name="user-type"
                            type="radio"
                            value="enterprise"
                            checked={this.state.tier=='enterprise'?true:false}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                            disabled={true}
                          />
                          <label
                            htmlFor="enterprise"
                            className="ml-2 block text-gray-700 font-bold cursor-pointer flex items-center gap-x-2"
                          ><span>Express</span>
                          </label>
                        </div>
                      </div>
                       

                        <Button
                            category={'primary'}
                            type='submit'
                            size={'small'}
                            title='Update'
                        />
                        {this.state.isUpdating ? (
                            <div className='ui center aligned grid'>
                                <Loading/>
                            </div>
                        ) : null}
                    </form>
                </div>
            </div>
        ) : null;
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
    {ChangeProfile}
)(GeneralSettings);
export {connectedComponent as GeneralSettings};
