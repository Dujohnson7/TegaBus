import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js"; 

export default function Express() {
  const history = useHistory();  
  const [searchTerm, setSearchTerm] = useState(""); 
  const [expressList, setExpressList] = useState([
    {
      id: 1,
      name: "Express 1",
      route: "Kigali - Huye",
      departureTime: "08:00",
      arrivalTime: "10:30",
      price: "2500",
      status: "active"
    },
    {
      id: 2,
      name: "Express 2",
      route: "Kigali - Musanze",
      departureTime: "10:00",
      arrivalTime: "12:00",
      price: "3000",
      status: "active"
    },
    {
      id: 3,
      name: "Express 3",
      route: "Kigali - Kibuye",
      departureTime: "12:00",
      arrivalTime: "14:30",
      price: "2800",
      status: "active"
    },
    {
      id: 4,
      name: "Express 4",
      route: "Kigali - Rusizi",
      departureTime: "14:00",
      arrivalTime: "16:30",
      price: "3200",
      status: "active"
    },
    {
      id: 5,
      name: "Express 5",
      route: "Kigali - Huye",
      departureTime: "16:00",
      arrivalTime: "18:30",
      price: "2500",
      status: "active"
    },
    {
      id: 6,
      name: "Express 6",
      route: "Kigali - Musanze",
      departureTime: "18:00",
      arrivalTime: "20:00",
      price: "3000",
      status: "active"
    }
  ]);
 

  const filteredExpressList = expressList.filter(express =>
    express.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    express.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    express.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const handleDelete = (id) => {
    setExpressList(expressList.filter(item => item.id !== id));
  };

 

  const handleAddNew = () => {
    history.push("/admin/express/add");
  };

  const handleUpdate = () => {
    history.push("/admin/express/add");
  };


  return (
    <> 
    {/* Show Express */}
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-3">
                <br />
              </div>
            </div>
 

            <CardTable>
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                      Express Routes
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search express routes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      /> 
                    </div>&nbsp;
                     <button onClick={handleAddNew}  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"> <i className="fas fa-plus mr-2"></i>  Add </button>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Name
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Route
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Departure
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Arrival
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Price
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Status
                      </th>
                      <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpressList.map((express) => (
                      <tr key={express.id}>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {express.name}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {express.route}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {express.departureTime}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {express.arrivalTime}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          RWF {express.price}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            express.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {express.status}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdate}
                              className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                            >
                              <i className="fas fa-edit mr-1"></i> 
                            </button> &nbsp;
                            <button
                              onClick={() => handleDelete(express.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium"
                            >
                              <i className="fas fa-trash mr-1"></i> 
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardTable>
          </div>
        </div>
      </div>
    </>
  );
}
