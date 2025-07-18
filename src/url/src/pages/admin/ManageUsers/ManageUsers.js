import React, { useState, useEffect } from 'react';
import { GetAdminDashboardAllUserData } from "../../../actions/account";
import { Loading } from '../../../components/shared/loading/Loading';

const ManageUsers = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const [loader, setLoader] = useState(false);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null

  useEffect(() => {
    fetData();
  }, [page, limit, query, status, sortOrder]);

  const fetData = async () => {
    setLoader(true);
    const res = await GetAdminDashboardAllUserData(page, limit, query, status);

    let userData = res?.body?.data?.map(user => ({
      name: user.firstName || '',
      lastName: user.lastName || '',
      userName: user.userName || '',
      phoneNumber: user.phoneNumber || '',
      dateOfJoining: user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : '',
      email: user.email || '',
      registrationType: user.registrationType || '',
      videos: user.videoCount || 0,
      status: 'Active'
    }));

    // Sort by name
    if (sortOrder === 'asc') {
      userData = userData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      userData = userData.sort((a, b) => b.name.localeCompare(a.name));
    }

    setUsers(userData);
    setPage(res?.body?.currentPage);
    setTotal(res?.body?.totalCount);
    setTotalPages(res?.body?.totalPage);
    setLoader(false);
  };

  const exportToCSV = () => {
    setLoader(true);
    const headers = ["Name", "Last Name", "Username", "Phone Number", "Email", "Registration Type", "Videos", "Status"];
    const rows = users.map(user => [
      user.name,
      user.lastName,
      user.userName,
      user.phoneNumber,
      user.email,
      user.registrationType,
      user.videos,
      user.status
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoader(false);
  };

  const getVisiblePages = (currentPage, totalPages, maxVisible = 4) => {
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  };

  const toggleSortOrder = () => {
    if (sortOrder === 'asc') setSortOrder('desc');
    else if (sortOrder === 'desc') setSortOrder(null);
    else setSortOrder('asc');
  };

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
                    onClick={() => setPage(1)}
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3"
                  >
                    Search
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={exportToCSV}
                className="bg-light-rose rounded px-4 py-3 border border-gray-200"
              >
                CSV
              </button>
              <div className="cmp-select">
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="ui selection dropdown select"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </form>

          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left cursor-pointer" onClick={toggleSortOrder}>
                  Name
                  <span className="ml-2">
                    {sortOrder === 'asc' && <i className="fas fa-arrow-up"></i>}
                    {sortOrder === 'desc' && <i className="fas fa-arrow-down"></i>}
                    {sortOrder === null &&  <i className="fas fa-arrow-down"></i>}
                  </span>
                </th>
                <th className="border p-2 text-left">Last Name</th>
                <th className="border p-2 text-left">Username</th>
                <th className="border p-2 text-left">Phone Number</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Registration Type</th>
                <th className="border p-2 text-left">Videos</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="border p-2">{user?.name}</td>
                    <td className="border p-2">{user?.lastName}</td>
                    <td className="border p-2">{user?.userName}</td>
                    <td className="border p-2">{user?.phoneNumber}</td>
                    <td className="border p-2">{user?.email}</td>
                    <td className="border p-2">{user?.registrationType}</td>
                    <td className="border p-2">{user?.videos}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
                        <div className="cmp-button">
                          <button className="medium button-secondary button">Active</button>
                        </div>
                        <div className="cmp-button">
                          <button className="medium button-secondary button">Deactivate</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className={`${loader ? 'loader-component' : ""}`}>
            {loader && <Loading center="center" />}
          </div>

          <div className="pagination mt-4 flex gap-2">
            {getVisiblePages(page, totalPages)?.map((p, index) =>
              p === -1 ? (
                <span key={index} className="px-3 py-1">...</span>
              ) : (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded ${page === p ? 'active' : 'bg-white text-dark border-primary'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ManageUsers;
