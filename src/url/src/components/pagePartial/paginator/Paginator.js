import React, { Component } from 'react';
import history from "../../../history";

class Paginator extends Component {

    constructor(props) {
        super(props);
    }

    pageUrl(pageNo) {
        return `${this.props.url}&pageNo=${pageNo}&pagesize=${this.props.paginator.pageSize}`;
    }

    navigate(pageNo) {
        history.push(this.pageUrl(pageNo));
    }

    render() {

        let list = [];
        let minBound = 1, maxBound = this.props.paginator.totalPages, pageNumber = this.props.paginator.pageNumber;
        let startIndex = pageNumber - 1 < minBound ? minBound : (pageNumber === maxBound ? pageNumber - 2 : pageNumber - 1),
            endIndex = pageNumber + 1 > maxBound ? maxBound : (pageNumber === 1 ? pageNumber + 2 : pageNumber + 1);

        for (let i = startIndex; i <= endIndex; i++) {
            list.push(<li key={i} className={`page-item ${(pageNumber === i) ? 'active' : ''}`}><a className='page-link' onClick={() => this.navigate(i)}>{i}</a></li>);
        }

        return (
            <div>
                <nav aria-label='Page navigation example'>
                    <ul className='pagination justify-content-end'>
                        {
                            (this.props.paginator.pageNumber != 1) ?
                                < li className='page-item'>
                                    <a className='page-link' onClick={() => this.navigate(this.props.paginator.pageNumber - 1)}>Previous</a>
                                </li> : null
                        }

                        {
                            list.map((li) => {
                                return li;
                            })
                        }

                        {
                            (this.props.paginator.pageNumber < this.props.paginator.totalPages) ?
                                < li className='page-item'>
                                    <a className='page-link' onClick={() => this.navigate(this.props.paginator.pageNumber + 1)}>Next</a>
                                </li> : null
                        }
                    </ul>
                </nav>
            </div >
        )
    }
}

export { Paginator };