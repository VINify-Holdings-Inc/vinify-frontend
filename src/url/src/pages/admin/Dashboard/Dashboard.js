import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetAdminDashboardTotalDataForKpi } from "../../../actions/account"
const Dashboard = () => {
  const [user, setUser] = useState(0)
  const [video, setvideo] = useState(0)
  useEffect(() => {
    fetData()
  }, [])

  const fetData = async () => {
    const res = await GetAdminDashboardTotalDataForKpi();
    setUser(res?.body?.userCount);
      console.log(res?.body?.userCount);
    setvideo(res?.body?.videoCount);
  }
  console.log(user,video);
  
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

      </div>

    </>
  )
}

export default Dashboard
