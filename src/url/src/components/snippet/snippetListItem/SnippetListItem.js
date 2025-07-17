import React, { Component } from "react";
import { connect } from "react-redux";
import site from "../../../sitemap";

class SnippetListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileDownloadUrl: null,
    };
  }

  //Render
  render() {
    return (
      <div
        className="rounded border border-gray-200 snippet"
        ref={this.props.snippet.snippet}
      >
        <div className="relative">
          <img src={this.props.snippet.thumbnailUrl} className="snippet-img" />
          <a
            href={`livePreview/${this.props.snippet.snippet}`}
            target="_blank"
            className="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"
          >
            <svg
              className="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                fill-rule="nonzero"
              />
            </svg>
            Preview
          </a>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center">
            <span
              className={`${
                this.props.snippet.status
                  ? "bg-green-600 text-green-900 rounded px-3 py-1 font-bold text-sm"
                  : "bg-gray-400 text-gray-900 rounded px-3 py-1 font-bold text-sm"
              }`}
            >
              {this.props.snippet.status ? "Active" : "Inactive"}
            </span>

            <small className="text-sm text-gray-400">
              {new Date(
                this.props.snippet.dateUpdatedUTC ||
                  this.props.snippet.dateCreatedUTC
              ).toDateString()}
            </small>
          </div>

          <div>
            <a
              href={`${site.routes.viewSnippet.route}/${this.props.snippet.snippet}`}
              className="mt-3 inline-block"
            >
              <h1 className="text-lg font-bold mt-3 mb-0">
                {this.props.snippet.title}
              </h1>
            </a>

            <div className="mt-4 flex items-center gap-x-3">
              <a
                href={`${site.routes.viewSnippet.route}/${this.props.snippet.snippet}`}
                className="text-primary font-bold flex items-center text-sm pr-3 border-r border-gray-200 hover:text-primary-dark hover:underline"
              >
                <svg
                  className="fill-current text-primary h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
                </svg>
                <span>Open</span>
              </a>

              <a
                href={
                  site.routes.reportsWithId.route +
                  "/" +
                  this.props.snippet.snippet
                }
                className="text-light-rose-dark font-bold flex gap-x-1 items-center text-sm hover:text-light-rose-dark hover:underline"
              >
                <svg
                  className="text-light-rose-dark h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Reports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sitemap: state.FlagReducer.Sitemap,
  };
};

const connectedComponent = connect(mapStateToProps, null)(SnippetListItem);

export { connectedComponent as SnippetListItem };
