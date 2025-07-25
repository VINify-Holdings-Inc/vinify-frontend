import React, { useState, useEffect } from 'react';
import { GetAdminDashboardAllUserData, AdminUserActiveInactive } from "../../../actions/account";
import { Loading } from '../../../components/shared/loading/Loading';
import history from '../../../history';
import { encryptString } from '../helpers'
const ManageUsers = (props) => {
  const [query, setQuery] = useState('');
  const [status1, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const [loader, setLoader] = useState(false);
  const [sortOrder, setSortOrder] = useState({
    firstName: 0,
    lastName: 0,
    phoneNumber: 0,
    email: 0,
    registrationType: 0,
    dateOfJoining: 0,
    lastActivityDate: 0,
    videos: 0,
    activeColumn: 'dateOfJoining'
  });

  useEffect(() => {
    fetData('');
  }, [page, limit, status1, sortOrder]);

  useEffect(() => {
    if (props?.userClick) {
      setQuery('');
      fetData('');
    }
  }, [props?.userClick]);

  const fetData = async (email = '') => {
    setLoader(true);
    try {
      const res = await GetAdminDashboardAllUserData(page, limit, email.trim(), status1, sortOrder);

      const responseData = res?.body?.data || [];

      const userData = responseData.map(user => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfJoining: user.dateOfJoining || '',
        lastActivityDate: user.lastActivityDate || '',
        email: user.email || '',
        registrationType: user.registrationType || '',
        videos: user.videoCount || 0,
        status: user.status
      }));

      setUsers(userData);
      setPage(res.body.currentPage);
      setTotal(res.body.totalCount);
      setTotalPages(res.body.totalPage);
    } catch (error) {
      setUsers([]);
      setPage(1);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoader(false);
    }
  };

  const handleSorting = (column) => {
    setSortOrder((prev) => ({
      ...prev,
      [column]: prev[column] === 0 ? 1 : 0,
      activeColumn: column
    }));
  };

  const exportToCSV = () => {
    if (!users || users.length === 0) {
      alert("No user data available to export.");
      return;
    }

    setLoader(true);

    const headers = [
      "First Name", "Last Name", "Phone Number",
      "Email", "Registration Type", "Registration Date", "Last Activity Date", "Videos", "Status"
    ];

    const rows = users.map(user => [
      user.firstName || "",
      user.lastName || "",
      user.phoneNumber || "",
      user.email || "",
      user.registrationType || "",
      user.dateOfJoining || "",
      user.lastActivityDate || "",
      user.videos || 0,
      user.status === 1 ? "Activated" : "Deactivated"
    ]);

    const csvContent =
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


  const updateUserStatus = async (email, newStatus) => {
    try {
      setLoader(true);

      const res = await AdminUserActiveInactive(email, newStatus);

      if (res?.result && res?.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.email === email ? { ...user, status: newStatus } : user
          )
        );
      } else {
        console.error("Status update failed:", res);
      }

    } catch (error) {
      console.error("Error while updating status:", error);
    } finally {
      setLoader(false);
    }
  };

  const redirectToUserCount = (videos, email) => {
    history.push(`/admin-video?email=${encryptString(email)}`)
  }



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
                    onClick={() => { setPage(1); fetData(query); }}
                    className="px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3"
                  >
                    Search
                  </button>
                  <button
                    type="submit"
                    onClick={() => { setPage(1); fetData(''); }}
                    className="clearbtn px-4 text-sm py-3 font-medium text-primary bg-white border border-primary rounded hover:bg-primary-dark group hover:text-white transition duration-150 ml-3"
                  >
                    Clear
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
                  value={status1}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="ui selection dropdown select"
                >
                  <option value="all">All</option>
                  <option value="1">Activated</option>
                  <option value="0">Deactivated</option>
                </select>

              </div>
            </div>
          </form>

          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("firstName")}>
                  First Name {sortOrder.activeColumn === "name" && (sortOrder.firstName === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("lastName")}>
                  Last Name {sortOrder.activeColumn === "lastName" && (sortOrder.lastName === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("phoneNumber")}>
                  Phone Number {sortOrder.activeColumn === "phoneNumber" && (sortOrder.phoneNumber === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("email")}>
                  Email {sortOrder.activeColumn === "email" && (sortOrder.email === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("registrationType")}>
                  Registration Type {sortOrder.activeColumn === "registrationType" && (sortOrder.registrationType === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("dateOfJoining")}>
                  Registration Date {sortOrder.activeColumn === "dateOfJoining" && (sortOrder.dateOfJoining === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("lastActivityDate")}>
                  Last Activity Date {sortOrder.activeColumn === "lastActivityDate" && (sortOrder.lastActivityDate === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left cursorPointer" onClick={() => handleSorting("videos")}>
                  Videos {sortOrder.activeColumn === "videos" && (sortOrder.videos === 0 ? '▼' : '▲')}
                </th>
                <th className="border p-2 text-left ">Action</th>
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
                    <td className="border p-2">{user?.firstName}</td>
                    <td className="border p-2">{user?.lastName}</td>
                    <td className="border p-2">{user?.phoneNumber}</td>
                    <td className="border p-2">{user?.email}</td>
                    <td className="border p-2">{user?.registrationType}</td>
                    <td className="border p-2">{user?.dateOfJoining}</td>
                    <td className="border p-2">{user?.lastActivityDate}</td>
                    <td className="border p-2 pointerAction" onClick={() => redirectToUserCount(user?.videos, user?.email)}> {user?.videos}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
                        <div className="cmp-button">
                          <button
                            className={
                              user?.status === 0
                                ? "medium button-secondary button butdisabled"
                                : "medium button-secondary button"
                            }
                            onClick={() => updateUserStatus(user?.email, 1)}
                          >
                            {user?.status === 1 ? 'Activated' : 'Active'}
                          </button>
                        </div>
                        <div className="cmp-button">
                          <button
                            className={
                              user?.status === 1
                                ? "medium button-secondary button butdisabled"
                                : "medium button-secondary button"
                            }
                            onClick={() => updateUserStatus(user?.email, 0)}
                          >
                            {user?.status === 0 ? 'Deactivated' : 'Deactivate'}
                          </button>
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
