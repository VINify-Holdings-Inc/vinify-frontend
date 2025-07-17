import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminLeftSideBar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-l-8 border-primary bg-light-rose">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="mx-auto">
              <NavLink to="/admin-dashboard">
                <img
                  className="h-14 w-auto mb-6"
                  src={require(`../../../../content/img/brand/logo.png`)}
                  alt="EyeMail Inc."
                />
              </NavLink>
            </div>
          </div>

          <nav className="mt-8 flex-1 px-4 bg-light-rose space-y-2">
            <NavLink
              to="/admin-dashboard"
              activeClassName="bg-light-rose-active text-white font-bold"
              className="hover:bg-light-rose-hover text-light-rose-menu-text group flex items-center px-2 py-2 text-base rounded-md"
            >
              <svg
                className="text-light-rose-menu mr-3 flex-shrink-0 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </NavLink>

            <NavLink
              to="/admin-manage-user"
              activeClassName="bg-light-rose-active text-white font-bold"
              className="hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md"
            >
              <svg
                className="text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A3 3 0 018 15h8a3 3 0 012.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Users
            </NavLink>

            <NavLink
              to="/admin-vedio"
              activeClassName="bg-light-rose-active text-white font-bold"
              className="hover:bg-light-rose-hover text-light-rose-dark group flex items-center px-2 py-2 text-base rounded-md"
            >
              <svg
                className="text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Vedioes
            </NavLink>
          </nav>
        </div>

        <div className="flex-shrink-0 flex justify-center border-t border-gray-200 p-4">
          <div className="flex items-center justify-center space-x-4">
            <img
              className="inline-block h-9 w-9 rounded-full"
              src={require(`../../../../content/img/default-img.png`)}
              alt=""
            />
            <div className="ml-2">
              <p className="text-base font-medium text-gray-700">Admin User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeftSideBar;
