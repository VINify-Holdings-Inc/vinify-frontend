import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SignUp.scss';
import { Loading } from '../../../components/shared';
import {TextBox, Button, CheckBox} from '../../../components/html';

import notification from '../../../core/services/alert';
import accountValidations from '../../../core/validations/accountValidations';
import { SignUpAction } from '../../../actions/account';
import { ChangeUser, ChangeLastRoute } from '../../../actions/system';
import history from '../../../history';
import formValidator from '../../../core/services/formValidator';
import Swal from 'sweetalert2'
import { Icon } from '../../../components/html/icon/Icon';
class SignUp extends Component {
  // State

  state = {
    loading: false,
    showPassword:false,
    showConfirmPassword:false,
    signUpForm: {
      fullName: {
        label: 'Your Name',
        value: '',
        id: 'fullName',
        required: true,
        validator: value => value != '',
        placeholder: 'Full name here',
        type: 'text',
        autoFocus: true,
        errorMessage: 'Please enter your name!',
        onChange: event => this._onChange(event),
        fluid: true,
        maxLength:90,
      },
      email: {
        label: 'Email',
        value: '',
        required: true,
        validator: email => accountValidations.validateEmail(email),
        id: 'email',
        placeholder: 'someone@example.com',
        errorMessage: 'Invalid email',
        type: 'email',
        onChange: event => this._onChange(event),
        fluid: true
      },
      password: {
        value: '',
        label: 'Password',
        required: true,
        validator: password => accountValidations.validatePassword(password),
        errorMessage: 'Invalid password',
        id: 'password',
        placeholder: '****',
        type: 'password',
        helpText:
          'Password must be 6-20 characters long, contains atleast one capital letter and one number',
        onChange: event => this._onChange(event),
        fluid: true
      },
      confirmPassword: {
        value: '',
        label: 'Confirm Password',
        required: true,
        validator: value => value === this.state.signUpForm.password.value,
        errorMessage: 'Passwords do not match',
        id: 'confirmPassword',
        placeholder: '****',
        type: 'password',
        onChange: event => this._onChange(event),
        fluid: true
      },
      tier:{
        value: "standard"
      },
    }
  };

  // Events

  _onChange = event => {
    let signUpForm = this.state.signUpForm;
    signUpForm[event.target.name].value = event.target.value;
    this.setState({
      signUpForm: signUpForm
    });
  };

  _onChangeUserType = (event) => {  
    let snippetForm = this.state.signUpForm;
    snippetForm.tier.value = event.target.value;
    this.setState({
        tier: snippetForm,
    });
  };

  _onClickSignup = async ev => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.signUpForm);
    this.setState({
      signUpForm: form
    });

    if (isValid) {
      this.setState({ loading: true });
      let user = {
        fullName: this.state.signUpForm.fullName.value,
        email: this.state.signUpForm.email.value,
        password: this.state.signUpForm.password.value,
        confirmPassword: this.state.signUpForm.confirmPassword.value,
        tier: this.state.signUpForm.tier.value,
      };
      await this.signUp(user);
    }
  };

  // Utils

  signUp = async user => {
    let response = await SignUpAction(user);
    this.setState({ loading: false });
    if (response.result) {
      this.props.changeUser(response.body);
      this.props.changeLastRoute(history.location.pathname);
      if (this.props.requestedRoute !== '/signup') {
        history.push(this.props.requestedRoute);
      } else {
        history.push('/?new');
      }
    } else {
      //notification.error(response.message, 'signUpFailed');
      Swal.fire({
        title: "Signup Failed!",
        text: `${response.message??"Signup Failed"}`,
        icon: "warning"
      });
    }
  };

  
  _onClickShowPassword = () => {
    
    let type = 'password';
    if (!this.state.showPassword) type = 'text';
    let signUpForm = this.state.signUpForm;
    signUpForm.password.type = type;
    this.setState((prevState) => {
      return {
        showPassword: !prevState.showPassword,
        signUpForm: signUpForm,
      };
    });
  };

  
  _onClickShowConfirmPassword = () => {
    
    let type = 'password';
    if (!this.state.showConfirmPassword) type = 'text';
    let signUpForm = this.state.signUpForm;
    signUpForm.confirmPassword.type = type;
    this.setState((prevState) => {
      return {
        showConfirmPassword: !prevState.showConfirmPassword,
        signUpForm: signUpForm,
      };
    });
  };

  // Render

  render() {
    return (
    <div className="flex min-h-full page-sign-up">
      <div className="flex flex-1 flex-col justify-center py-12 md:w-1/2 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="form-area">
            <div className='text-center'>
              <a href="https://eyemailinc.com/" target='_blank'>
                <img
                    src={require(`../../../content/img/brand/logo.gif`)}
                    id="logo"
                    className='mx-auto h-20'
                    alt="EyeMail Inc."
                    title="EyeMail Inc."
                />
              </a>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 mb-3">Create an account so we can start to bring your emails to life!</h2>
            </div>

            <div className='form mt-4'>
              <form noValidate onSubmit={this._onClickSignup}>
                <TextBox {...this.state.signUpForm.fullName} className='w-full mb-4' />
                <TextBox {...this.state.signUpForm.email} className='w-full mb-4' />
                <div  style={{ display: `flex`, }}>
                  <TextBox {...this.state.signUpForm.password}  className='w-full mb-2'/>
                  <span
                        style={{ fontSize: `1rem`,marginTop:`43px`,marginLeft: `-22px`}}
                        className={(this.state.showPassword)?`icon fas fa-eye`:`icon fas fa-eye-slash`}
                        onClick={this._onClickShowPassword}
                    ></span>
                </div>
                <div  style={{ display: `flex`, }}>
                <TextBox {...this.state.signUpForm.confirmPassword} className='w-full mb-6' />
                  <span
                      style={{ fontSize: `1rem`,marginTop:`43px`,marginLeft: `-22px`}}
                      className={(this.state.showConfirmPassword)?`icon fas fa-eye`:`icon fas fa-eye-slash`}
                      onClick={this._onClickShowConfirmPassword}
                    ></span>
                </div>
                <div className='cmp-text-box gap-y-5 sm:gap-x-10  mb-2' style={{"font-weight":"600"}}>Registration Type&nbsp;
                     {/* <div className="tooltip"><span className='infom'>i</span>
                      <span className="tooltiptext">Tooltip text</span>
                    </div>  */}
                   

                      <Icon
                        icon={'info-circle'}
                        type={'solid'}
                        dataContent={(
                                        <>
                                          Premium (i) Allows full feature set options to upload of logo, video, graphics, call to action buttons
                                          <br /><br />
                                          Express (i) Allows upload of Video only to export HTML
                                        </>
                                      )}
                      /> 
                
                </div>
                
                  <div  onChange={this._onChangeUserType} className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4" style={{"marginBottom":"20px"}}>
                       <div className="flex items-center"  >
                          <input
                            id="standard"
                            name="user-type"
                            type="radio"
                            value="standard"
                            defaultChecked
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                            required={true}
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
                             className="focus:ring-primary h-4 w-4 text-primary border-gray-300 cursor-pointer"
                            tabIndex={0}
                            required={true}
                            
                          />
                          <label
                            htmlFor="enterprise"
                            className="ml-2 block text-gray-700 font-bold cursor-pointer flex items-center gap-x-2"
                          ><span>Express</span>
                          </label>
                        </div>
                      </div>
                <Button
                    fontSize={'1.2'}
                    className='w-full button-primary'
                    category={'primary'}
                    fluid={true}
                    type='submit'
                    title='Create an account'
                />
                <p className='mt-4 text-center mb-6'>
                  Already have an account? &nbsp;
                  <a className='actionButton' href='/signin'>
                    Login
                  </a>
                </p>

                {this.state.loading ? (
                    <div className='ui center aligned grid'>
                      <Loading />
                    </div>
                ) : null}
                <small className='txt-privacy-statement'>
                  To find out more about how we’re using the information
                  you’re giving us, please review our{' '}
                  <a href='/privacy-policy' className='font-primary'>privacy statement</a>.
                </small>
              </form>
            </div>

            <div className='mt-3'>
              <small className='txt-privacy-statement'>
                By signing up, you agree to our&nbsp;
                <a className='actionButton' href='/terms-of-service'>
                  Terms of Service
                </a>{' '}
                and&nbsp;
                <a className='actionButton' href='/privacy-policy'>
                  Cookie Policy
                </a>
                .
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 md:block">
        <img className="absolute inset-0 h-full w-full object-cover"
             src={require(`../../../content/img/brand/register.jpg`)}
             alt="" />
      </div>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  requestedRoute: state.FlagReducer.RequestedRoute
});

const mapDispatchToProps = dispatch => {
  return {
    changeUser: user => {
      dispatch(ChangeUser(user));
    },
    changeLastRoute: route => {
      dispatch(ChangeLastRoute(route));
    }
  };
};

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
export { connectedComponent as SignUp };
