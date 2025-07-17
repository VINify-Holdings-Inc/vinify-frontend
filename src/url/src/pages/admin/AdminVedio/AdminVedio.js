import React, { useState } from 'react';

const AdminVedio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('All');

  // Sample video data
  const videoList = Array(8).fill({
    img: "https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg",
    createdAt: "July 15, 2025 at 06:10 PM",
    previewLink: "livePreview/0cc79610-c7da-47f7-871d-c20f80581402",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "Status:", status);
    // Call your API here with searchQuery and status
  };

  return (
    <>
      <div className="topHeadarea">
        <div className="topheadingsection">
          <h1 className="text-2xl font-bold mb-0">Manage Videos</h1>
          <p className="mt-1">Streamline your video library.</p>
        </div>
      </div>

      <div className="TableBottom-area grid lg:grid-cols-1 lg:gap-x-8 gap-y-8 mt-6">
        <div className="border border-gray-200 rounded p-8 md:p-10">
          <h1 className="text-2xl font-bold mb-4">Video List</h1>

          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0 mb-8 gap-y-5 md:gap-x-8">
              <div className="form-group cmp-text-box w-full">
                <div className="flex fluid action input">
                  <input
                    type="text"
                    name="query"
                    id="query"
                    placeholder="Search..."
                    className="bg-light-rose rounded px-4 py-3 border border-gray-200 w-full md:w-8/12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="cmp-select">
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="ui selection dropdown select"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </form>

          <div className="videoLIst">
            <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
              {videoList.map((video, index) => (
                <div key={index} className="rounded border border-gray-200 snippet">
                  <div className="relative">
                    <img src={video.img} alt="Thumbnail" className="snippet-img" />
                    <a
                      href={video.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"
                    >
                      <svg
                        className="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                        clipRule="evenodd"
                        fillRule="evenodd"
                        strokeLinejoin="round"
                        strokeMiterlimit="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                          fillRule="nonzero"
                        />
                      </svg>
                      Preview
                    </a>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <small className="text-sm text-gray-400">
                        Created at: {video.createdAt}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="pagination mt-4 flex gap-2">
              <button className="active">1</button>
              <button>2</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminVedio;
