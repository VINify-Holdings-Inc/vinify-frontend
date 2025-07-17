import React from 'react';
const AdminVedio = () => {
  return (
    <>
      <div className="topHeadarea">
        <div className="topheadingsection">
          <h1 className="text-2xl font-bold mb-0">Manage Videos</h1>
          <p className="mt-1">Streamline your video library.</p>
        </div>
      </div>

      <div className='TableBottom-area grid lg:grid-cols-1 lg:gap-x-8 gap-y-8 mt-6'>
        <div className='border border-gray-200 rounded p-8 md:p-10'>
          <h1 className="text-2xl font-bold mb-4">Video List</h1>
          <form novalidate="">
            <div
              className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0 mb-8 gap-y-5 md:gap-x-8">
              <div className="form-group cmp-text-box w-full">
                <div className="flex fluid  action  input"><input type="text" name="query"
                  className="bg-light-rose rounded px-4 py-3 border border-gray-200 w-full md:w-8/12 " id="query"
                  placeholder="Search..." required="" value="" /><button type="submit"
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3">Search</button>
                </div>
              </div>
              <div className="cmp-select ">
                <div name="status" id="status" role="listbox" aria-busy="false" aria-expanded="false"
                  aria-multiselectable="false" className="ui selection dropdown select">
                  <div aria-atomic="true" aria-live="polite" role="alert" className="divider default text">Select Status</div>
                  <i aria-hidden="true" className="dropdown icon"></i>
                  <div className="menu transition">
                    <div role="option" aria-checked="false" aria-selected="true"
                      className="selected item"><span className="text">All</span></div>
                    <div role="option" aria-checked="false" aria-selected="false"
                      className="item"><span className="text">Active</span></div>
                    <div role="option" aria-checked="false" aria-selected="false"
                      className="item"><span className="text">Inactive</span></div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="videoLIst">
            <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              <div class="rounded border border-gray-200 snippet">
                <div class="relative"><img
                  src="https://staging-assets-dev.s3.us-east-2.amazonaws.com/7d3e1d7c-1868-49a3-9c87-233882fbbbfa.jpg"
                  class="snippet-img" /><a href="livePreview/0cc79610-c7da-47f7-871d-c20f80581402" target="_blank"
                    class="absolute right-4 top-3 text-base text-white drop-shadow-2xl flex items-center group text-shadow hover:text-primary"><svg
                      class="fill-current h-5 text-white drop-shadow-md group-hover:text-primary transition duration-500"
                      clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
                        fill-rule="nonzero"></path>
                    </svg>Preview</a></div>
                <div class="p-6">
                  <div class="flex justify-between items-center">
                    <small class="text-sm text-gray-400">Created at: July 15, 2025 at 06:10 PM</small>
                  </div>
                </div>
              </div>

              
            </section>
            <div className="pagination mt-4 flex gap-2">
                <button className="active">1</button>
                  <button className="">2</button>
              </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminVedio
