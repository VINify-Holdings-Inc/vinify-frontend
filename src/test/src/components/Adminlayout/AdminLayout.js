import React from "react";
import { Route } from "react-router-dom";
import AdminLeftSideBar from "../../pages/admin/common/AdminLeftSideBar/AdminLeftSideBar";
import AdminFooter from "../../pages/admin/common/AdminFooter";

const AdminLayout = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
         <AdminLeftSideBar/> 
          <main className="md:pl-64 flex flex-col flex-1">
            <div className="flex-1">
              <div className="pt-8 pb-5">
                <div className="container mx-auto px-4 sm:px-6 md:px-10">
                  <div className="admin_mains">
                    <Component {...props} />
                  </div>
                </div>
              </div>
            </div>
          </main> 
          <AdminFooter/>
        </>
      )}
    />
  );
};

export default AdminLayout;
