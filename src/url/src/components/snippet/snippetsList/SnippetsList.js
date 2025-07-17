import React from 'react';

import './SnippetList.scss';

import { SnippetListItem } from '../';
import { Loading } from '../../shared';

class SnippetsList extends React.Component {
  //Render

  render() {
    return (
        <>
          {this.props.snippets === null || this.props.snippets === undefined ? (
              <div className='ui center aligned grid'>
                <Loading />
              </div>
          ) : this.props.snippets.length > 0 ? (
              <>
                <section className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6'>
                  {this.props.snippets.slice(0, this.props.show).map((snippet, key) => {
                    return (
                        <div key={key}>
                          <SnippetListItem
                              // onClickThumbnail={this.setSelectedVideo.bind(this)}
                              // updateSnippets={this.props.updateSnippets}
                              snippet={snippet}
                          />
                        </div>
                    );
                  })}

                  {/* {this.state.snippets.length > 1 ? (
                <Paginator
                  paginator={this.state.searchFilter.paginator}
                  url={`/snippets?title=${this.state.searchFilter.title}`}
                />
              ) : null} */}
                </section>

                  {this.props.show && this.props.snippets.length > 4 &&
                      <div className='text-center my-8'>
                          <a href='/eyemails' className='border-2 border-primary px-4 py-2 text-base rounded hover:bg-primary hover:text-white transition duration-200 text-primary font-bold text-center inline-block'>View All</a>
                      </div>
                  }

              </>
          ) : (
              <div className='bg-light-rose rounded py-6 px-6 md:px-10 empty-box'>
                <p className='feedback-text text-light-rose-dark'>No EyeMails found.</p>
              </div>
          )}
        </>
    );
  }
}

export { SnippetsList };
