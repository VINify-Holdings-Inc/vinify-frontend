import React, { useEffect, useState } from 'react';
import { GetAdminDashboardAllVedio } from '../../../actions/account';
import { Loading } from '../../../components/shared/loading/Loading';
import { decryptString } from '../helpers'
const AdminVedio = (props) => {
 
  const [status, setStatus] = useState('All');
  const [video, setvideo] = useState([])
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailUrl = decryptString(params.get('email'));
    setEmail(emailUrl)
    fetData(emailUrl)

  }, [])

  useEffect(()=>{
if(props?.videoItem){
    setEmail('')
    fetData('')
}
  },[props?.videoItem])

  const fetData = async (emailUrl) => {
    setLoader(true);
    try {
      const res = await GetAdminDashboardAllVedio(emailUrl !== '' ? emailUrl : null);

      if (!res) {
        throw new Error("Invalid video data from server");
      }

      setvideo(res.body.urLs);
      setCount(res.body.countData);
      setLoader(false);
    } catch (error) {
      setvideo([]);
        setCount(0);
      setLoader(false);
    } finally {
      setLoader(false);
    }
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

          <form >
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0 mb-8 gap-y-5 md:gap-x-8">
              <div className="form-group cmp-text-box w-full">
                <div className="flex fluid action input">
                  <input
                    type="text"
                    placeholder="Search by email"
                    className="bg-light-rose rounded px-4 py-3 border border-gray-200 w-full md:w-8/12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fetData(email);
                    }}
                    type="submit"
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3"
                  >
                    Search
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEmail('')
                      fetData('');
                    }}
                    type="submit"
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3 clearbtn"
                  >
                    Clear
                  </button>

                </div>
              </div>

              <div className="cmp-select showingNumber">
                {count > -1 ? ` Showing Videos: ${count} ` : ""}
              </div>
            </div>
          </form>

          <section className="min-h-[100px]">
            {loader ? (
              <div className="loader-component">
                <Loading center="center" />
              </div>
            ) : video.length === 0 ? (
              <div className="text-center text-gray-500 text-lg py-10">
                No records found
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                {video.map((items, index) => (
                  <div key={index} className="rounded border border-gray-200 snippet">
                    <div className="relative video-blocks">
                      {/* <img src={items.gifUrl} alt="Thumbnail" className="snippet-img" /> */}
                      <video src={items.url} controls height='180' width='350' />

                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <small className="text-sm text-gray-400">
                          Created at:{" "}
                          {items.createdDate}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
};

export default AdminVedio;


