import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import history from '../../../../history';
import {SignOutAction} from '../../../../actions/account'
import  site from '../../../../sitemap'
const AdminLeftSideBar = (prop) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const profileShowToggle = () => {
    setShowProfileOptions(!showProfileOptions);
  };
const handleSignOut=async()=>{ 
    history.push('/signin');
  //  let response = await SignOutAction();
  //  console.log(response,"###################"); 
  //         if (response.result) {
  //             history.replace(site.routes.signIn);
  //            // window.location.reload();
  //         } else {
  //             alert.error('Unable to sign out');
  //         } 
}
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
              {/* Dashboard icon */}
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
              {/* Manage Users icon */}
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
              {/* Video icon */}
              <svg className="text-light-rose-dark group-hover:text-light-rose-menu-text mr-3 flex-shrink-0 h-6 w-6" width="21px" height="21px" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Media
            </NavLink>
          </nav>
        </div>

        {/* Admin user section */}
        <div className="flex-shrink-0 flex justify-center border-t border-gray-200 p-4 relative">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={profileShowToggle}>
            <img
              className="inline-block h-9 w-9 rounded-full"
              src={require(`../../../../content/img/default-img.png`)}
              alt=""
            />
            <div>
              <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">Admin User</p>
            </div>
            <svg className="h-4 w-4 fill-current text-light-rose-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
            </svg>

            {showProfileOptions && (
              <div onClick={handleSignOut} className="absolute left-0 top-[60px] z-50 w-40 origin-top-right text-left rounded-md bg-light-rose shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="block px-4 py-3 text-base text-light-rose-dark hover:text-light-rose-menu-text hover:bg-light-rose-hover transition duration-150 rounded-md cursor-pointer">
                  Sign out
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLeftSideBar;
