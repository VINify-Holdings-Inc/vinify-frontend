import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetAdminDashboardTotalDataForKpi } from "../../../actions/account"
import { Loading } from '../../../components/shared/loading/Loading';

const Dashboard = () => {
  const [user, setUser] = useState(0)
  const [video, setvideo] = useState(0)
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    fetData()
  }, [])

const fetData = async () => {
  setLoader(true);
  try {
    const res = await GetAdminDashboardTotalDataForKpi();
 
    setUser(res.body.userCount || 0);
    setvideo(res.body.videoCount || 0);
  } catch (error) { 
    setUser(0);
    setvideo(0); 
  } finally {
    setLoader(false);
  }
};

  return (
    <>
      <div className='topHeadarea'>
        <div className='topheadingsection'>
          <h1 className="text-2xl font-bold mb-0">Hello, Admin!</h1>
          <p className="mt-1">Welcome to the Admin Dashboard.</p>
        </div>
      </div>
      <div className='kips-area grid lg:grid-cols-2 lg:gap-x-8 gap-y-8 mt-6'>
        <Link to="/admin-manage-user">
          <div className='border border-gray-200 rounded p-8 md:p-10'>
            <p className="font-bold text-lg mb-2">Users</p>
            <h1 className="text-3xl font-bold">{user}</h1>
          </div>
        </Link>
        <Link to="/admin-vedio">
          <div className='border border-gray-200 rounded p-8 md:p-10'>
            <p className="font-bold text-lg mb-2">Media</p>
            <h1 className="text-3xl font-bold">{video}</h1>
          </div>
        </Link>
        <div className={`${loader ? 'loader-component' : ""}`}>
          {loader && <Loading center="center" />}
        </div>
      </div>

    </>
  )
}

export default Dashboard
