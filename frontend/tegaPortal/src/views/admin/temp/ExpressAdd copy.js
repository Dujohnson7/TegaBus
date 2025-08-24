import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function ExpressAdd() {
  const history = useHistory();
  const [expressData, setExpressData] = useState({
    name: "",
    route: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    status: "active"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpressData({
      ...expressData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("New Express Data:", expressData);
     
    alert("Express route added successfully!");
    history.push("/admin/express");
  };

  const handleCancel = () => {
    history.push("/admin/express");
  };

  return (
    <>
      {/* Express Add */}
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Add Registration</h6>
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
            >
              Back
            </button>
          </div>
        </div>

            <form onSubmit={handleSubmit} className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={expressData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter express name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route *
                  </label>
                  <input
                    type="text"
                    name="route"
                    value={expressData.route}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Kigali - Huye"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={expressData.departureTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Time *
                  </label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={expressData.arrivalTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (RWF) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={expressData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={expressData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>&nbsp;&nbsp;&nbsp;
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-tail-600 transition-colors"
                > 
                  <i className="fas fa-save mr-2"></i>
                  Save Express
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
