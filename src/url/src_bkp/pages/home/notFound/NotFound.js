import React, { Component } from 'react';
import history from '../../../history'

import { ResourceNotFound } from '../../../components/pagePartial';

class NotFound extends Component {
    render() {
        return (
            <ResourceNotFound title='page' />
        );
    }
}

export { NotFound };