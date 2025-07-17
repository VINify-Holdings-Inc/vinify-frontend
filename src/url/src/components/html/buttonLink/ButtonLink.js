import React, {Component} from 'react';

class ButtonLink extends Component {
    render() {
        return (
            <>
                {
                    this.props.type === 'secondary'
                        ? <a href={this.props.href}
                             className={this.props.size === 'small'
                                 ? 'px-4 text-sm py-3 font-bold text-primary bg-white border-2 border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150'
                                 : 'px-10 py-3 font-bold text-primary bg-white border-2 border-primary rounded group hover:bg-primary-dark hover:text-white transition duration-150'}>
                            {this.props.addIcon ? <svg className='fill-current text-primary inline-block mr-2 group-hover:text-white'
                                                       xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                       viewBox="0 0 24 24">
                                <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
                            </svg> : ''}
                            {this.props.text}
                        </a>
                        : <a href={this.props.href}
                             className={this.props.size === 'small'
                                 ? 'px-4 text-sm py-3 font-bold text-white bg-primary rounded hover:bg-primary-dark hover:text-white transition duration-150'
                                 : 'px-10 py-3 font-bold text-white bg-primary rounded hover:bg-primary-dark hover:text-white transition duration-150'}>
                            {this.props.addIcon ? <svg className='fill-current text-white inline-block mr-2'
                                                       xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                       viewBox="0 0 24 24">
                                <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
                            </svg> : ''}
                            {this.props.text}
                        </a>
                }
            </>

        )
    }
}

export {ButtonLink};