import React from "react";
import { Link } from "react-router-dom";

import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const role = userObj.role ? userObj.role.toUpperCase() : "";

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "fas fa-tv",
      roles: ["SUPER_ADMIN", "ADMIN", "DRIVER", "AGENT"],
    },
    {
      name: "My Profile",
      path: "/admin/settings",
      icon: "fas fa-tools",
      roles: ["SUPER_ADMIN", "ADMIN", "DRIVER", "AGENT"],
    },
    {
      name: "Express",
      path: "/admin/express",
      icon: "fas fa-route",
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "fas fa-users",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "fas fa-bus",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      name: "Destinations",
      path: "/admin/destinations",
      icon: "fas fa-map-marker-alt",
      roles: ["SUPER_ADMIN", "ADMIN", "AGENT"],
    },
    {
      name: "Schedules",
      path: "/admin/schedules",
      icon: "fas fa-calendar-alt",
      roles: ["SUPER_ADMIN", "ADMIN", "DRIVER", "AGENT"],
    },
    {
      name: "Tickets",
      path: "/admin/tickets",
      icon: "fas fa-ticket-alt",
      roles: ["SUPER_ADMIN", "ADMIN", "AGENT"],
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "fas fa-chart-bar",
      roles: ["SUPER_ADMIN", "ADMIN", "AGENT"],
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto 
        md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap 
        items-center justify-between relative md:w-64 z-10 py-4 px-6">

        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 
          flex flex-wrap items-center justify-between w-full mx-auto">

          {/* Mobile menu button */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>

          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap 
              text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
              TEGA<span className="text-green">Bus</span>
          </Link>

          {/* Mobile User Dropdown */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Sidebar content */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 " +
              "md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto " +
              "overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >

            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block 
                      whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    TEGABUS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl 
                      leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Menu */}
            <hr className="my-4 md:min-w-full" />
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4">
              Menu
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {menuItems
                .filter((item) => item.roles.includes(role))
                .map((item, idx) => (
                  <li key={idx} className="items-center">
                    <Link
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.indexOf(item.path) !== -1
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to={item.path}
                    >
                      <i
                        className={
                          item.icon +
                          " mr-2 text-sm " +
                          (window.location.href.indexOf(item.path) !== -1
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                      ></i>{" "}
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>

            {/* Visit Site - visible to all */}
            <hr className="my-4 md:min-w-full" />
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <a
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  href="http://localhost:7700/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Visit Site
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
