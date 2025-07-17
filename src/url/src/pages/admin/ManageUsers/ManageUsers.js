import React, { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const pageSize = 5;

  const fetchUsersFromServer = ({ filter }) => {
    const allUsers = [
      { name: 'Vivek Mishra', videos: 8, status: "Active" },
      { name: 'Niharika Singh', videos: 80, status: "Inactive" },
      { name: 'Amit Singh', videos: 18, status: "Active" },
      { name: 'Rohit Sharma', videos: 32, status: "Inactive" },
      { name: 'Suman Yadav', videos: 5, status: "Active" },
      { name: 'Nitin Sinha', videos: 25, status: "Active" },
    ];

    return allUsers.filter(user => {
      const matchesQuery = user.name.toLowerCase().includes(filter.query.toLowerCase());
      const matchesStatus = filter.status === "All" || user.status === filter.status;
      return matchesQuery && matchesStatus;
    });
  };

  useEffect(() => {
    const data = fetchUsersFromServer({ filter: { query, status } });
    setUsers(data);
    setPage(1); // Reset to page 1 on filter change
  }, [query, status]);

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(users.length / pageSize);

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
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0 mb-8 gap-y-5 md:gap-x-8">
              <div className="form-group cmp-text-box w-full">
                <div className="flex fluid action input">
                  <input
                    type="text"
                    name="query"
                    className="bg-light-rose rounded px-4 py-3 border border-gray-200 w-full md:w-8/12"
                    id="query"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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

              {/* <div className="cmp-select">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-3"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div> */}
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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">No users found.</td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.videos}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
                        <div className="cmp-button">
                          <button className="medium button-secondary button">View</button>
                        </div>
                        <div className="cmp-button">
                          <button className="medium button-secondary button">Disable</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination mt-4 flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                 className="active"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
