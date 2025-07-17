import React, { Component } from 'react';

class SnippetGridItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ''
        }
    }

    componentDidMount() {
        if (this.props.status)
            this.setState({
                status: "card-body text-dark status-active"
            })

        else if (!this.props.status)
            this.setState({
                status: "card-body text-dark status-inactive"
            })
    }

    render() {
        return (
            <li className='list-inline-item'
                ref={this.props.id}
                style={{ width: '20rem' }}>
                <div className='card clickable'>
                    <div className={this.state.status}>
                        <h5 className='text-ellipsis'><strong>{this.props.title}</strong></h5>
                        <p><strong>Width:</strong> <br />{this.props.width}px</p>
                    </div>
                </div>
            </li>
        );
    }
}

export { SnippetGridItem };