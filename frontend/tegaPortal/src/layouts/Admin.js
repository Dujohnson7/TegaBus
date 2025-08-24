import Users from "views/admin/Users.js";
import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

import Dashboard from "views/Index.js"; 
import Settings from "views/admin/Settings.js";
import Express from "views/admin/Express.js"; 
import Buses from "views/admin/Buses.js";
import Destinations from "views/admin/Destinations.js";
import Schedules from "views/admin/Schedules.js";
import Tickets from "views/admin/Tickets.js";
import Reports from "views/admin/Reports.js";
import ExpressAdd from "views/admin/ExpressAdd.js";
import UserAdd from "views/admin/UserAdd.js";
import BusAdd from "views/admin/BusAdd.js";
import DestinationAdd from "views/admin/DestinationAdd.js";
import ScheduleAdd from "views/admin/ScheduleAdd.js";
import TicketAdd from "views/admin/TicketAdd.js";
import ExpressEdit from "views/admin/ExpressEdit.js";
import UserEdit from "views/admin/UserEdit.js";
import DestinationEdit from "views/admin/DestinationEdit.js";
import BusEdit  from "views/admin/BusEdit.js";
import ScheduleEdit  from "views/admin/ScheduleEdit.js";


function PrivateRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem("token");
  const expressId = localStorage.getItem("expressId");
  const isAuthenticated = !!token && !!expressId;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
}

export default function Admin() {
  const location = useLocation();
  const isDashboard = location.pathname === "/admin";
   
  const getPageTitle = () => {
    if (location.pathname.includes("/admin/express")) return "Express Management";
    if (location.pathname.includes("/admin/users")) return "Users Management";
    if (location.pathname.includes("/admin/buses")) return "Buses Management";
    if (location.pathname.includes("/admin/destinations")) return "Destinations Management";
    if (location.pathname.includes("/admin/schedules")) return "Schedules Management";
    if (location.pathname.includes("/admin/tickets")) return "Tickets Management";
    if (location.pathname.includes("/admin/reports")) return "Reports Management";
    if (location.pathname.includes("/admin/settings")) return "Settings";
    if (location.pathname.includes("/admin/tables")) return "Tables";
    if (location.pathname.includes("/add")) return "Add New";
    return "Dashboard";
  };

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar pageTitle={getPageTitle()} />
         
        <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
             
          </div>
        </div>
         
        {isDashboard && <HeaderStats />}
        
        <div className="px-4 md:px-10 mx-auto w-full -mt-24">
          <Switch>
            <PrivateRoute path="/admin" exact component={Dashboard} /> 
            <PrivateRoute path="/admin/settings" exact component={Settings} />
            {/* <PrivateRoute path="/admin/tables" exact component={Tables} /> */}
            <PrivateRoute path="/admin/express" exact component={Express} />
            <PrivateRoute path="/admin/users" exact component={Users} />
            <PrivateRoute path="/admin/buses" exact component={Buses} />
            <PrivateRoute path="/admin/destinations" exact component={Destinations} />
            <PrivateRoute path="/admin/schedules" exact component={Schedules} />
            <PrivateRoute path="/admin/tickets" exact component={Tickets} />
            <PrivateRoute path="/admin/reports" exact component={Reports} />
            <PrivateRoute path="/admin/express/add" exact component={ExpressAdd} />
            <PrivateRoute path="/admin/users/add" exact component={UserAdd} />
            <PrivateRoute path="/admin/buses/add" exact component={BusAdd} />
            <PrivateRoute path="/admin/destinations/add" exact component={DestinationAdd} />
            <PrivateRoute path="/admin/schedules/add" exact component={ScheduleAdd} />
            <PrivateRoute path="/admin/tickets/add" exact component={TicketAdd} />
            <PrivateRoute path="/admin/express/edit/:expressId?" component={ExpressEdit} /> 
            <PrivateRoute path="/admin/users/edit/:id" component={UserEdit} />
            <PrivateRoute path="/admin/destinations/edit/:id" component={DestinationEdit} />
            <PrivateRoute path="/admin/buses/edit/:id" component={BusEdit} />
            <PrivateRoute path="/admin/schedules/edit/:id" component={ScheduleEdit} />

            <Redirect from="/" to="/admin" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
