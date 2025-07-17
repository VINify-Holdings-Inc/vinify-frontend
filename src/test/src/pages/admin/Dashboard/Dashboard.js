  import React from 'react';
const Dashboard = () => {
  return (
    <>
      <div className='topHeadarea'>
        <div className='topheadingsection'>
          <h1 className="text-2xl font-bold mb-0">Hello, Admin!</h1>
          <p className="mt-1">Welcome to the Admin Dashboard.</p>
        </div>
      </div>
      <div className='kips-area grid lg:grid-cols-2 lg:gap-x-8 gap-y-8 mt-6'>
        <div className='border border-gray-200 rounded p-8 md:p-10'>
          <p className="font-bold text-lg mb-2">Total Users</p>
          <h1 className="text-3xl font-bold">120</h1>
        </div>
        <div className='border border-gray-200 rounded p-8 md:p-10'>
          <p className="font-bold text-lg mb-2">Total Videos</p>
          <h1 className="text-3xl font-bold">350</h1>
        </div>

      </div>
     
    </>
  )
}

export default Dashboard
