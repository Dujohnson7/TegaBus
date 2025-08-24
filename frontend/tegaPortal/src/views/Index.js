import React from "react";
 
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js"; 

export default function Dashboard() {
  return (
    <>
    {/* Card stats */}
      <div className="flex flex-wrap"> 
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div> 
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
      </div> 
    </>
  );
}
