import React from "react"; 

export default function FooterAdmin() {
  return (
    <>
    {/* Footer */}
      <footer className="block py-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12">
              <div className="text-sm text-blueGray-500 w-fit font-semibold py-1 text-center md:text-left">
                Copyright © 2025 TEGABUS. All rights reserved || Developed by Dujohnson    
              </div>
            </div> 
          </div>
        </div>
      </footer>
    </>
  );
}
