// import React from 'react';

// const SkeletonBarChart = () => {
//   return (
//     <div className="bar-chart-container animate-pulse">
//       {/* Year Selector Skeleton */}
//       <div className="card-year-selector mb-5">
//         <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-32 bg-gray-300 rounded inline-block"></div>
//       </div>

//       {/* Data Type Selector Skeleton */}
//       <div className="data-type-selector mb-5">
//         <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-20 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-20 bg-gray-300 rounded inline-block"></div>
//       </div>

//       {/* Total Sum/Count Skeleton */}
//       <div className="mb-5">
//         <div className="h-6 w-48 bg-gray-300 rounded"></div>
//       </div>

//       {/* Chart Skeleton */}
//       <div className="chart-container">
//         <div className="h-64 w-full bg-gray-300 rounded"></div>
//       </div>
//     </div>
//   );
// };

// const SkeletonLineChart = () => {
//   return (
//     <div className="line-chart-container animate-pulse">
//       {/* Year Selector Skeleton */}
//       <div className="card-year-selector mb-5">
//         <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-32 bg-gray-300 rounded inline-block"></div>
//       </div>

//       {/* Data Type Selector Skeleton */}
//       <div className="data-type-selector mb-5">
//         <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-20 bg-gray-300 rounded mr-2 inline-block"></div>
//         <div className="h-10 w-20 bg-gray-300 rounded inline-block"></div>
//       </div>

//       {/* Total Sum/Count Skeleton */}
//       <div className="mb-5">
//         <div className="h-6 w-48 bg-gray-300 rounded"></div>
//       </div>

//       {/* Chart Skeleton */}
//       <div className="chart-container">
//         <div className="h-64 w-full bg-gray-300 rounded"></div>
//       </div>
//     </div>
//   );
// };

// const SkeletonPieChart = () => {
//   return (
//     <div className="animate-pulse" style={{ width: '400px', height: '300px', margin: 'auto' }}>
//       <div className="h-full w-full bg-gray-300 rounded-full"></div>
//     </div>
//   );
// };

// const SkeletonDoughnutChart = () => {
//   return (
//     <div className="animate-pulse" style={{ width: '400px', height: '300px', margin: 'auto' }}>
//       <div className="h-full w-full bg-gray-300 rounded-full"></div>
//     </div>
//   );
// };

// export { SkeletonBarChart, SkeletonLineChart, SkeletonPieChart, SkeletonDoughnutChart };

import React from "react";

const SkeletonBarChart = () => {
  return (
    <div className="bar-chart-container animate-pulse">
      {/* Year Selector Skeleton */}
      <div className="card-year-selector mb-5">
        <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-32 bg-gray-300 rounded inline-block"></div>
      </div>

      {/* Data Type Selector Skeleton */}
      <div className="data-type-selector mb-5">
        <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-20 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-20 bg-gray-300 rounded inline-block"></div>
      </div>

      {/* Total Sum/Count Skeleton */}
      <div className="mb-5">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="chart-container">
        <div className="h-64 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const SkeletonLineChart = () => {
  return (
    <div className="line-chart-container animate-pulse">
      {/* Year Selector Skeleton */}
      <div className="card-year-selector mb-5">
        <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-32 bg-gray-300 rounded inline-block"></div>
      </div>

      {/* Data Type Selector Skeleton */}
      <div className="data-type-selector mb-5">
        <div className="h-6 w-24 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-20 bg-gray-300 rounded mr-2 inline-block"></div>
        <div className="h-10 w-20 bg-gray-300 rounded inline-block"></div>
      </div>

      {/* Total Sum/Count Skeleton */}
      <div className="mb-5">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="chart-container">
        <div className="h-64 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const SkeletonPieChart = () => {
  return (
    <div
      className="animate-pulse"
      style={{ width: "300px", height: "300px", margin: "auto" }}
    >
      <div className="h-full w-full bg-gray-300 rounded-full"></div>
    </div>
  );
};

const SkeletonDoughnutChart = () => {
  return (
    <div
      className="animate-pulse"
      style={{ width: "300px", height: "300px", margin: "auto" }}
    >
      <div className="h-full w-full bg-gray-300 rounded-full"></div>
    </div>
  );
};

export {
  SkeletonBarChart,
  SkeletonLineChart,
  SkeletonPieChart,
  SkeletonDoughnutChart,
};
