import React, { useState, useEffect } from 'react';


const fetchUsersFromServer = ({ filter, sort, page, pageSize }) => {
  // Mock data (replace this with real API)
  const allUsers = [
    { name: 'Vivek Mishra', videos: 8 },
    { name: 'Niharika Singh', videos: 80 },
    { name: 'Amit Singh', videos: 18 },
    { name: 'Rohit Sharma', videos: 32 },
    { name: 'Suman Yadav', videos: 5 },
    { name: 'Nitin Sinha', videos: 25 },
  ];


  // Apply filter
  let filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Apply sort
  if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'videos') {
    filtered.sort((a, b) => b.videos - a.videos);
  }

  const total = filtered.length;

  // Apply pagination
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return { users: paginated, total };
};

const ManageUsers = () => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const { users, total } = fetchUsersFromServer({ filter, sort, page, pageSize });
    setUsers(users);
    setTotalRecords(total);
  }, [filter, sort, page, pageSize]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <div className="topHeadarea">
        <div className="topheadingsection">
          <h1 className="text-2xl font-bold mb-0">Manage Users</h1>
          <p className="mt-1">Your user management hub.</p>
        </div>
      </div>

      <div className='TableBottom-area grid lg:grid-cols-1 lg:gap-x-8 gap-y-8 mt-6'>
        <div className='border border-gray-200 rounded p-8 md:p-10'>
          <h1 className="text-2xl font-bold mb-4">List of Users</h1>

          {/* Filter + Sort */}


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

          {/* Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Videos</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="3" className="p-4 text-center">No users found.</td></tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.videos}</td>
                    <td className="border p-2">

                      <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
                        <div className="cmp-button">
                          <button className="medium button-secondary button"> View </button>
                        </div>
                        <div className="cmp-button">
                          <button className="medium button-secondary button"> Disable </button>
                        </div>
                      </div>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}

          <div className="pagination mt-4 flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
