import React from "react";

const SkeletonLoader = () => (
  <div className="flex w-full max-w-3xl mx-auto px-4 py-2 justify-start">
    <div className="bg-white p-4 rounded-lg max-w-[80%] border border-gray-200">
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;