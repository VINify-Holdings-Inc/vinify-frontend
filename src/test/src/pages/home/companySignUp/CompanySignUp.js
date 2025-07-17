import React, { Component } from 'react';
import { connect } from 'react-redux';

import './companySignUp.scss';
import { Loading } from '../../../components/shared';
import { TextBox, Button } from '../../../components/html';

import { CompanySignUpAction } from '../../../actions/account';
import accountValidations from '../../../core/validations/accountValidations';
import notification from '../../../core/services/alert';

class CompanySignUp extends Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._onClickSignup = this._onClickSignup.bind(this);

    this.state = {
      loading: false,
      fullName: '',
      email: '',
      password: '',
      companyName: '',
      domain: '',
      department: ''
    };
  }

  // Events

  _onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    document.getElementById(
      `companySignUp-${event.target.name}-feedback`
    ).style.display = 'none';
  }

  async _onClickSignup(ev) {
    ev.preventDefault();

    let emailValid = accountValidations.validateEmail(this.state.email),
      passwordValid = accountValidations.validatePassword(this.state.password),
      domainValid = accountValidations.validateUrl(this.state.domain);

    if (emailValid & passwordValid) {
      this.setState({ loading: true });
      let company = {
        fullName: this.state.fullName,
        email: this.state.email,
        password: this.state.password,
        companyName: this.state.companyName,
        domain: this.state.domain,
        department: this.state.department
      };
      await this.signUp(company);
    } else if (!emailValid && !passwordValid) {
      document.getElementById('companySignUp-email-feedback').style.display =
        'block';
      document.getElementById('companySignUp-password-feedback').style.display =
        'block';
    } else if (!emailValid) {
      document.getElementById('companySignUp-email-feedback').style.display =
        'block';
    } else {
      document.getElementById('companySignUp-password-feedback').style.display =
        'block';
    }
  }

  // Utils

  async signUp(company) {
    let response = await CompanySignUpAction(company);
    this.setState({ loading: false });
    if (response) {
      notification.success('success');
    } else {
      notification.error('Fail');
    }
  }

  // Render

  render() {
    return (
      <div className='cmp-company-sign-up'>
        <div className='signup-background'>
          <div className='layer-dim' />
        </div>
        <div className='ui grid'>
          <div className='row'>
            <div className='centered eight wide computer thirteen wide tablet sixteen wide mobile column'>
              <div className='head'>
                {/* <div className='logo'>
                <img
                  src={require(`../../../content/img/brand/logo.png`)}
                  width='170'
                  id='logo'
                  alt='EyeMail Inc.'
                  title='EyeMail Inc.'
                />
              </div> */}
                <h1>Sign up for free</h1>
                <p>
                  Start sending beautifully designed emails today with our
                  drag-and-drop editor and library of free templates.
                </p>
              </div>
              <div className='form' onSubmit={this._onClickSignup}>
                <form>
                  <div className='ui grid'>
                    <div className='row pb-0'>
                      <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                        <div className='form-group'>
                          <label htmlFor='fullName'>Your name</label>
                          <TextBox
                            placeholder='Full name here'
                            id='fullName'
                            type='text'
                            name='fullName'
                            autoFocus
                            value={this.state.fullName}
                            onChange={this._onChange}
                            required
                          />
                          <div
                            id='companySignUp-fullName-feedback'
                            className='invalid-feedback'>
                            Please enter your name!
                          </div>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='email'>Email</label>
                          <TextBox
                            type='email'
                            placeholder='someone@example.com'
                            id='email'
                            name='email'
                            value={this.state.email}
                            onChange={this._onChange}
                            required
                          />
                          <div
                            id='companySignUp-email-feedback'
                            className='invalid-feedback'>
                            Invalid email!
                          </div>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='password'>Password</label>
                          <TextBox
                            type='password'
                            placeholder='****'
                            id='password'
                            name='password'
                            value={this.state.password}
                            onChange={this._onChange}
                            ariaDescribedby='passwordHelpBlock'
                            required
                          />
                          <div
                            id='companySignUp-password-feedback'
                            className='invalid-feedback'>
                            Invalid password!
                          </div>
                          <small
                            id='passwordHelpBlock'
                            className='text-hint text-muted'>
                            Password must be 6-20 characters long, contains
                            atleast one capital letter and one number
                          </small>
                        </div>
                      </div>
                      <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                        <div className='form-group'>
                          <label htmlFor='companyName'>Your company name</label>
                          <TextBox
                            type='text'
                            placeholder='Company name here'
                            id='companyName'
                            name='companyName'
                            value={this.state.companyName}
                            onChange={this._onChange}
                            required
                          />
                          <div
                            id='companySignUp-companyName-feedback'
                            className='invalid-feedback'>
                            Please enter your company name.
                          </div>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='department'>Department</label>
                          <TextBox
                            type='text'
                            placeholder='Your department here'
                            id='department'
                            name='department'
                            value={this.state.department}
                            onChange={this._onChange}
                            required
                          />
                          <div
                            id='companySignUp-department-feedback'
                            className='invalid-feedback'>
                            Please enter your department name.
                          </div>
                        </div>
                        <div className='form-group'>
                          <label htmlFor='domain'>Company domain</label>
                          <TextBox
                            type='text'
                            placeholder='http://www.example.com'
                            id='domain'
                            name='domain'
                            value={this.state.domain}
                            onChange={this._onChange}
                            required
                          />
                          <div
                            id='companySignUp-domain-feedback'
                            className='invalid-feedback'>
                            Please enter domain name!
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='centered eleven wide computer eleven wide tablet sixteen wide mobile column pt-0'>
                      <Button
                        fontSize={'1.2'}
                        category={'base'}
                        fluid={true}
                        type='submit'
                        title='Sign up'
                      />
                      {this.state.loading ? (
                        <div className='text-center'>
                          <Loading />
                        </div>
                      ) : null}
                      <small className='txt-privacy-statement'>
                        To find out more about how we’re using the information
                        you’re giving us, please review our{' '}
                        <a>privacy statement</a>.
                      </small>
                    </div>
                  </div>
                </form>
              </div>
              <div className='foot'>
                <p className='link-sign-in'>
                  Already have an account? &nbsp;
                  <a className='actionButton' href='/signin'>
                    Login
                  </a>
                </p>
                <p className='link-policies'>
                  By signing up, you agree to our{' '}
                  <a className='actionButton'>Terms of Use</a> and{' '}
                  <a className='actionButton'>Anti-spam Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const connectedComponent = connect(
  mapStateToProps,
  null
)(CompanySignUp);

export { connectedComponent as CompanySignUp };
