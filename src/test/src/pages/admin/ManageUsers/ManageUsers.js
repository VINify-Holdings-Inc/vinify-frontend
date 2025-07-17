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
    <div className='TableBottom-area grid lg:grid-cols-1 lg:gap-x-8 gap-y-8 mt-6'>
      <div className='border border-gray-200 rounded p-8 md:p-10'>
        <h1 className="text-2xl font-bold mb-4">List of Users</h1>

        {/* Filter + Sort */}
        <div className="flex flex-wrap mb-4 gap-4">
          <input
            type="text"
            placeholder="Search user"
            className="border p-2 rounded w-full md:w-auto"
            value={filter}
            onChange={(e) => {
              setPage(1);
              setFilter(e.target.value);
            }}
          />
          <select
            className="border p-2 rounded"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="videos">Videos (High to Low)</option>
          </select>
        </div>

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
                     <td>
                  <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
                    <div className="cmp-button">
                      <button className="medium button-secondary button"> View </button>
                    </div>
                    <div className="cmp-button">
                      <button className="medium button-secondary button"> Disable </button>
                    </div>
                  </div>
                </td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-600  ' : 'bg-white'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
