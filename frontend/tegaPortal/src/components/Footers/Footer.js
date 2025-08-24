import React from "react"; 

export default function Footer() {
  return (
    <>
    {/* Footer */}
      <footer className="relative bg-blueGray-200 pt-8 pb-6">
        
        <div className="container mx-auto px-4"> 
          <hr className="my-6 border-blueGray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
                Copyright © 2025 TEGABUS. All rights reserved || Developed by Dujohnson
              </div> 
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
