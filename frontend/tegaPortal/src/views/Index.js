import React from "react";
 
import CardLineChart from "components/Cards/CardLineChart.js"; 
import CardBarChart from "components/Cards/CardBarChart.js"; 

export default function Dashboard() {
  return (
    <>
    {/* Card stats */}
      <div className="flex flex-wrap"> 
        <div className="w-full xl:w-6/12 px-4">
          <CardLineChart />
        </div>   
        <div className="w-full xl:w-6/12 px-4">
          <CardBarChart />
        </div>  
      </div> 
    </>
  );
}
