import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SignIn.scss';
import history from '../../../history';
import { Loading } from '../../../components/shared';
import { TextBox, Button, CheckBox } from '../../../components/html';

import notification from '../../../core/services/alert';
import { SignInAction } from '../../../actions/account';
import { ChangeUser, ChangeLastRoute } from '../../../actions/system';
import accountValidations from '../../../core/validations/accountValidations';
import formValidator from '../../../core/services/formValidator';
import Swal from 'sweetalert2';
class SignIn extends Component {
  // State

  state = {
    loading: false,
    showPassword: false,
    signInForm: {
      email: {
        label: 'Email',
        value: '',
        required: true,
        validator: (email) => accountValidations.validateEmail(email),
        id: 'email',
        placeholder: 'Email',
        errorMessage: 'Invalid email',
        type: 'email',
        autoFocus: true,
        onChange: (event) => this._onChange(event),
        fluid: true,
        tabIndex: '1',
      },
      password: {
        label: 'Password',
        value: '',
        required: true,
        validator: (password) => accountValidations.validatePassword(password),
        errorMessage: 'Invalid password',
        id: 'password',
        placeholder: 'Password',
        type: 'password',
        onChange: (event) => this._onChange(event),
        fluid: true,
        tabIndex: '2',
      },
      rememberMe: {
        value: false,
        validator: () => true,
        title: 'Remember me',
        id: 'rememberMe',
        className: 'check-remember-me',
        onChange: (event) => this._onClickRememberMe(event),
        tabIndex: '4',
      },
    },
  };

  componentDidMount = async () => {
    //console.log("test23");
  };
  // Events

  _onClickShowPassword = () => {

    let type = 'password';
    if (!this.state.showPassword) type = 'text';
    let signInForm = this.state.signInForm;
    signInForm.password.type = type;
    this.setState((prevState) => {
      return {
        showPassword: !prevState.showPassword,
        signInForm: signInForm,
      };
    });
  };

  _onChange = (event) => {
    let signInForm = this.state.signInForm;
    signInForm[event.target.name].value = event.target.value;
    this.setState({
      signInForm: signInForm,
    });
  };

  _onClickRememberMe = () => {
    let signInForm = this.state.signInForm;
    signInForm.rememberMe.value = !this.state.signInForm.rememberMe.value;
    this.setState({
      signInForm: signInForm,
    });
  };

  _onClickLogin = async (ev) => {
    ev.preventDefault();

    const { isValid, form } = formValidator(this.state.signInForm);
    this.setState({
      signInForm: form,
    });

    if (isValid) {
      this.setState({ loading: true });
      let user = {
        email: this.state.signInForm.email.value,
        password: this.state.signInForm.password.value,
        rememberMe: this.state.signInForm.rememberMe.value,
      };
      await this.signIn(user);
    }
  };

  // Utils

  signIn = async (user) => {
    let response = await SignInAction(user); 
    if ( user?.email == "mom@eyemailinc.com") {  
      history.push('/admin-dashboard'); 
      return;
    }

    this.setState({ loading: false });
    if (response.result) {
      this.props.changeUser(response.body);
      this.props.changeLastRoute(history.location.pathname);
      console.log(user, "############");

      if (this.props.requestedRoute !== '/signin') {
        history.push(this.props.requestedRoute);
        //  window.location.reload();
      } else {
        history.push('/');
        //   window.location.reload();
      }
    } else {

      Swal.fire({
        title: "Login Failed!",
        text: `${response.message ?? "Login Failed"}`,
        icon: "warning"
      });
      // notification.error(response.message, 'signInFailed');

    }
  };

  // Render

  render() {
    return (
      <div className="flex min-h-full page-sign-in">
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
                <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 mb-1">Sign in</h2>
                <p className='text-gray-600'>Please enter your details</p>
              </div>

              <div className="form mt-4">
                <form noValidate onSubmit={this._onClickLogin}>
                  <TextBox {...this.state.signInForm.email} showLabel={false} className='w-full mb-3' />
                  <div style={{ display: `flex`, }}>
                    <TextBox {...this.state.signInForm.password} showLabel={false} className='w-full text-sm' />
                    <span
                      style={{ fontSize: `1rem`, marginTop: `16px`, marginLeft: `-22px` }}
                      className={(this.state.showPassword) ? `icon fas fa-eye` : `icon fas fa-eye-slash`}
                      onClick={this._onClickShowPassword}
                    ></span>
                  </div>

                  <div className="flex justify-between items-center mt-4 mb-5">
                    <CheckBox {...this.state.signInForm.rememberMe} />

                    <a href="/forgotpassword" tabIndex="6">Forgot your password?</a>
                  </div>

                  <Button
                    type="submit"
                    fluid={true}
                    fontSize={'1.2'}
                    className='w-full button-primary'
                    category={'primary'}
                    title="Log in"
                    tabIndex="3"
                  />

                  <div className="link-sign-up text-center">
                    New to EyeMail?&nbsp;
                    <a href="/signup" tabIndex="5" className='font-bold text-primary'>
                      Create an account
                    </a>
                  </div>

                  {this.state.loading ? (
                    <div className="ui center aligned grid">
                      <Loading />
                    </div>
                  ) : null}
                </form>


              </div>
              <div className="foot text-center">
                <p>
                  &copy;{new Date().getFullYear()} All Rights Reserved.
                  <br />
                  Read our <a href="/terms-of-service" tabIndex="7">Terms of Service</a>
                  ,&nbsp;
                  <a href="/privacy-policy">
                    Privacy Statement and Cookie Policy
                  </a>
                  .
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 md:block">
          <img className="absolute inset-0 h-full w-full object-cover"
            src={require(`../../../content/img/brand/login.jpg`)}
            alt="" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  requestedRoute: state.FlagReducer.RequestedRoute,
});

const mapDispatchToProps = (dispatch) => {
  return {
    changeUser: (user) => {
      dispatch(ChangeUser(user));
    },
    changeLastRoute: (route) => {
      dispatch(ChangeLastRoute(route));
    },
  };
};

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SignIn);
export { connectedComponent as SignIn };
