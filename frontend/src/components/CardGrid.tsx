import React from "react";

const CardGrid = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 h-screen">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold px-2 py-1 m-2 rounded-md">
              New
            </div>
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold px-2 py-1 m-2 rounded-md">
              New
            </div>
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src="https://via.placeholder.com/600x360"
            />
            <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
              3 min read
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium text-gray-800 mb-2">Title</div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non
              aliquam quam massa id lacus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
