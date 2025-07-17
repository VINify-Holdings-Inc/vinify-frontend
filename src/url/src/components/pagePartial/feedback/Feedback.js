import React, { Component } from 'react';
import { connect } from 'react-redux';

import alert from '../../../core/services/alert';
import { FeedBack, FeedBackStatus } from '../../../actions/system';

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
        this._inputHandler = this._inputHandler.bind(this);
    }

    _inputHandler(value) {
        this.setState({
            input: value.target.value
        })
        if (value.target.value.trim().length === 0) {
            document.getElementById('feedbackInput').classList.add('is-invalid');
        }
        else {
            document.getElementById('feedbackInput').classList.remove('is-invalid');
        }
    }

    componentDidUpdate() {
        return (this.props.feedBackResponse !== null) ?
            (this.props.feedBackResponse == true) ?
                alert.success('Done!', 'Thank you for your feedback. We\'ll be processing your request as fast as we can.')
                    .then(() => {
                        this.props.feedBackStatusDispatch(null);
                    })
                :
                alert.error('Failed!', 'Failed to send your feedback please try again')
                    .then(() => {
                        this.props.feedBackStatusDispatch(null);
                    })
            : null
    }

    render() {
        return (
            <div className='row justify-content-md-center'>
                <div className='col-lg-12 mb-4 mt-3'>
                    <h4>How can we improve?</h4>
                </div>
                <div className='col-lg-12'>
                    <div className='form-group'>
                        <textarea id='feedbackInput' className='form-control' value={this.state.input} onChange={this._inputHandler} rows='5'></textarea>
                        <div className='invalid-feedback'>
                            Please write something to submit.
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <button data-dismiss='modal' className='btn btn-solid' disabled={this.state.input.trim().length === 0} onClick={() => {
                        this.props.feedBackDispatch(this.state.input)
                        this.setState({
                            input: ''
                        })
                    }}>Submit</button>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return ({
        feedBackResponse: state.FlagReducer.FeedBackResponse,
        user: state.UserReducer.User
    });
}

function mapDispatchToProps(dispatch) {
    return ({
        feedBackDispatch: (email, feedback) => {
            dispatch(FeedBack(email, feedback))
        },
        feedBackStatusDispatch: (bool) => {
            dispatch(FeedBackStatus(bool))
        }
    });
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(Feedback)
export { connectedComponent as Feedback };