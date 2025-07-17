import React, { Component } from 'react'
import { GetPicture } from '../../../actions/system';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picture: null
        }
    }
    async componentDidMount() {
        // let response = await GetPicture(this.props.Id);
        // this.setState({
        //     picture: response.picture
        // })
    }
    render() {
        return (
            this.state.picture === null ?
                null :
                <img style={{ maxHeight: '200px' }} alt={this.props.Id} src={`/api/files/${this.props.Id}`} />
        )
    }
}

export { Image };