// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import PropTypes from 'prop-types';
// import 'chart.js/auto'; // Ensure that all necessary chart types are registered

// const LineChartComponent = ({ prf_summary, selectedYear, onYearChange }) => {
//   const jalaliMonths = [
//     'فروردین',
//     'اردیبهشت',
//     'خرداد',
//     'تیر',
//     'مرداد',
//     'شهریور',
//     'مهر',
//     'آبان',
//     'آذر',
//     'دی',
//     'بهمن',
//     'اسفند',
//   ];

//   // State to store total sum and count
//   const [totalSum, setTotalSum] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
  
//   // State to track selected data type: 'price' or 'count'
//   const [dataType, setDataType] = useState('price');

//   useEffect(() => {
//     if (prf_summary) {
//       if (selectedYear === 'all' && prf_summary.yearly_data) {
//         const sum = prf_summary.yearly_data.reduce(
//           (acc, item) => acc + parseFloat(item.total_price),
//           0
//         );
//         const count = prf_summary.yearly_data.reduce(
//           (acc, item) => acc + parseInt(item.count, 10),
//           0
//         );
//         setTotalSum(sum);
//         setTotalCount(count);
//       } else if (prf_summary.monthly_data) {
//         const sum = prf_summary.monthly_data.reduce(
//           (acc, item) => acc + parseFloat(item.total_price),
//           0
//         );
//         const count = prf_summary.monthly_data.reduce(
//           (acc, item) => acc + parseInt(item.count, 10),
//           0
//         );
//         setTotalSum(sum);
//         setTotalCount(count);
//       } else {
//         setTotalSum(0);
//         setTotalCount(0);
//       }
//     }
//   }, [prf_summary, selectedYear]);

//   const buildChartData = () => {
//     if (!prf_summary) return { labels: [], datasets: [] };

//     if (selectedYear === 'all' && prf_summary.yearly_data) {
//       const labels = prf_summary.yearly_data.map((item) => item.year);
//       const dataPoints = prf_summary.yearly_data.map((item) => 
//         dataType === 'price' ? parseFloat(item.total_price) : item.count
//       );

//       return {
//         labels,
//         datasets: [
//           {
//             label: dataType === 'price' ? 'مجموع قیمت ثبت سفارش  به تفکیک سال' : 'تعداد ثبت سفارش ها به تفکیک سال',
//             data: dataPoints,
//             borderColor: dataType === 'price' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 159, 64, 1)',
//             backgroundColor: dataType === 'price' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 159, 64, 0.2)',
//             fill: true,
//             tension: 0.4,
//           },
//         ],
//       };
//     }

//     if (prf_summary.monthly_data) {
//       const monthlyValues = Array(12).fill(0);
//       prf_summary.monthly_data.forEach((item) => {
//         const idx = item.month - 1;
//         if (idx >= 0 && idx < 12) { // Ensure month is within 1-12
//           monthlyValues[idx] = dataType === 'price' ? parseFloat(item.total_price) : item.count;
//         }
//       });

//       return {
//         labels: jalaliMonths,
//         datasets: [
//           {
//             label: dataType === 'price' ? `مجموع قیمت در سال ${selectedYear}` : `تعداد ثبت سفارش ها در سال ${selectedYear}`,
//             data: monthlyValues,
//             borderColor: dataType === 'price' ? 'rgba(153, 102, 255, 1)' : 'rgba(54, 162, 235, 1)',
//             backgroundColor: dataType === 'price' ? 'rgba(153, 102, 255, 0.2)' : 'rgba(54, 162, 235, 0.2)',
//             fill: true,
//             tension: 0.4,
//           },
//         ],
//       };
//     }

//     return { labels: [], datasets: [] };
//   };

//   const chartData = buildChartData();

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text:
//           selectedYear === 'all'
//             ? (dataType === 'price' ? 'مجموع قیمت ثبت سفارش  به تفکیک سال' : 'تعداد ثبت سفارش ها به تفکیک سال')
//             : (dataType === 'price' ? `مجموع قیمت در سال ${selectedYear}` : `تعداد ثبت سفارش ها در سال ${selectedYear}`),
//         font: {
//           size: 18,
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== null) {
//               if (dataType === 'price') {
//                 label += context.parsed.y.toLocaleString() + ' یورو';
//               } else {
//                 label += context.parsed.y.toLocaleString() + ' عدد';
//               }
//             }
//             return label;
//           },
//         },
//       },
//       legend: {
//         display: true,
//         position: 'top',
//       },
//     },
//     scales: {
//       y: { 
//         beginAtZero: true,
//         ticks: {
//           // Include a thousands separator
//           callback: function(value) {
//             if (dataType === 'price') {
//               return value.toLocaleString() + ' یورو';
//             } else {
//               return value.toLocaleString() + ' عدد';
//             }
//           },
//         },
//         title: {
//           display: true,
//           text: dataType === 'price' ? 'مبلغ (یورو)' : 'تعداد',
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: selectedYear === 'all' ? 'سال' : 'ماه',
//         },
//       },
//     },
//   };

//   return (
//     <div className="line-chart-container">
//       <div className="card-year-selector" style={{ marginBottom: '20px' }}>
//         <label htmlFor="year-selector">انتخاب سال:</label>
//         <select
//           id="year-selector"
//           value={selectedYear}
//           onChange={(e) => onYearChange(e.target.value)}
//           style={{ marginLeft: '10px', padding: '5px' }}
//         >
//           <option value="all">همه سال‌ها</option>
//           {prf_summary?.yearly_data?.map((item) => (
//             <option key={item.year} value={item.year}>
//               {item.year}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Data Type Selector */}
//       <div className="data-type-selector" style={{ marginBottom: '20px' }}>
//         <label>نمایش داده‌ها:</label>
//         <button
//           onClick={() => setDataType('price')}
//           style={{
//             marginLeft: '10px',
//             padding: '5px 10px',
//             backgroundColor: dataType === 'price' ? '#4bc0c0' : '#e0e0e0',
//             color: dataType === 'price' ? '#fff' : '#000',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           ارزش
//         </button>
//         <button
//           onClick={() => setDataType('count')}
//           style={{
//             marginLeft: '10px',
//             padding: '5px 10px',
//             backgroundColor: dataType === 'count' ? '#36a2eb' : '#e0e0e0',
//             color: dataType === 'count' ? '#fff' : '#000',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           تعداد
//         </button>
//       </div>

//       {/* Display the total sum and count based on data type */}
//       <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
//         {dataType === 'price' ? (
//           <>
//             مجموع قیمت: {totalSum.toLocaleString()} یورو
//           </>
//         ) : (
//           <>
//             تعداد ثبت سفارش ها: {totalCount.toLocaleString()} عدد
//           </>
//         )}
//       </div>

//       <div className="chart-container">
//         {chartData.labels.length > 0 ? (
//           <Line data={chartData} options={chartOptions} />
//         ) : (
//           <p>داده‌ای برای نمایش وجود ندارد.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // Adding PropTypes for better type checking
// LineChartComponent.propTypes = {
//   prf_summary: PropTypes.shape({
//     yearly_data: PropTypes.arrayOf(
//       PropTypes.shape({
//         year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//         total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//         count: PropTypes.number.isRequired,  // Updated to include count
//       })
//     ),
//     monthly_data: PropTypes.arrayOf(
//       PropTypes.shape({
//         month: PropTypes.number.isRequired,
//         total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//         count: PropTypes.number.isRequired,  // Updated to include count
//       })
//     ),
//   }),
//   selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   onYearChange: PropTypes.func.isRequired,
// };

// export default LineChartComponent;




import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import 'chart.js/auto';

const LineChartComponent = ({ prf_summary, selectedYear, onYearChange }) => {
  const jalaliMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  const [totalSum, setTotalSum] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [dataType, setDataType] = useState('price');

  useEffect(() => {
    if (prf_summary) {
      if (selectedYear === 'all' && prf_summary.yearly_data) {
        const sum = prf_summary.yearly_data.reduce(
          (acc, item) => acc + parseFloat(item.total_price),
          0
        );
        const count = prf_summary.yearly_data.reduce(
          (acc, item) => acc + parseInt(item.count, 10),
          0
        );
        setTotalSum(sum);
        setTotalCount(count);
      } else if (prf_summary.monthly_data) {
        const sum = prf_summary.monthly_data.reduce(
          (acc, item) => acc + parseFloat(item.total_price),
          0
        );
        const count = prf_summary.monthly_data.reduce(
          (acc, item) => acc + parseInt(item.count, 10),
          0
        );
        setTotalSum(sum);
        setTotalCount(count);
      } else {
        setTotalSum(0);
        setTotalCount(0);
      }
    }
  }, [prf_summary, selectedYear]);

  const buildChartData = () => {
    if (!prf_summary) return { labels: [], datasets: [] };

    if (selectedYear === 'all' && prf_summary.yearly_data) {
      const labels = prf_summary.yearly_data.map((item) => item.year);
      const dataPoints = prf_summary.yearly_data.map((item) => 
        dataType === 'price' ? parseFloat(item.total_price) : item.count
      );

      return {
        labels,
        datasets: [
          {
            label: dataType === 'price' ? 'مجموع قیمت ثبت سفارش به تفکیک سال' : 'تعداد ثبت سفارش‌ها به تفکیک سال',
            data: dataPoints,
            borderColor: dataType === 'price' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 159, 64, 1)',
            backgroundColor: dataType === 'price' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 159, 64, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    if (prf_summary.monthly_data) {
      const monthlyValues = Array(12).fill(0);
      prf_summary.monthly_data.forEach((item) => {
        const idx = item.month - 1;
        if (idx >= 0 && idx < 12) {
          monthlyValues[idx] = dataType === 'price' ? parseFloat(item.total_price) : item.count;
        }
      });

      return {
        labels: jalaliMonths,
        datasets: [
          {
            label: dataType === 'price' ? `مجموع قیمت در سال ${selectedYear}` : `تعداد ثبت سفارش‌ها در سال ${selectedYear}`,
            data: monthlyValues,
            borderColor: dataType === 'price' ? 'rgba(153, 102, 255, 1)' : 'rgba(54, 162, 235, 1)',
            backgroundColor: dataType === 'price' ? 'rgba(153, 102, 255, 0.2)' : 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  };

  const chartData = buildChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text:
          selectedYear === 'all'
            ? (dataType === 'price' ? 'مجموع قیمت ثبت سفارش به تفکیک سال' : 'تعداد ثبت سفارش‌ها به تفکیک سال')
            : (dataType === 'price' ? `مجموع قیمت در سال ${selectedYear}` : `تعداد ثبت سفارش‌ها در سال ${selectedYear}`),
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (dataType === 'price') {
                label += context.parsed.y.toLocaleString() + ' یورو';
              } else {
                label += context.parsed.y.toLocaleString() + ' عدد';
              }
            }
            return label;
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (dataType === 'price') {
              return value.toLocaleString() + ' یورو';
            } else {
              return value.toLocaleString() + ' عدد';
            }
          },
        },
        title: {
          display: true,
          text: dataType === 'price' ? 'مبلغ (یورو)' : 'تعداد',
        },
      },
      x: {
        title: {
          display: true,
          text: selectedYear === 'all' ? 'سال' : 'ماه',
        },
      },
    },
  };

  return (
    <div className="line-chart-container">
      <div className="card-year-selector" style={{ marginBottom: '20px' }}>
        <label htmlFor="year-selector">انتخاب سال:</label>
        <select
          id="year-selector"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="all">همه سال‌ها</option>
          {prf_summary?.yearly_data?.map((item) => (
            <option key={item.year} value={item.year}>
              {item.year}
            </option>
          ))}
        </select>
      </div>

      <div className="data-type-selector" style={{ marginBottom: '20px' }}>
        <label>نمایش داده‌ها:</label>
        <button
          onClick={() => setDataType('price')}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: dataType === 'price' ? '#4bc0c0' : '#e0e0e0',
            color: dataType === 'price' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ارزش
        </button>
        <button
          onClick={() => setDataType('count')}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: dataType === 'count' ? '#36a2eb' : '#e0e0e0',
            color: dataType === 'count' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          تعداد
        </button>
      </div>

      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        {dataType === 'price' ? (
          <>
            مجموع قیمت: {totalSum.toLocaleString()} یورو
          </>
        ) : (
          <>
            تعداد ثبت سفارش‌ها: {totalCount.toLocaleString()} عدد
          </>
        )}
      </div>

      <div className="chart-container">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>داده‌ای برای نمایش وجود ندارد.</p>
        )}
      </div>
    </div>
  );
};

LineChartComponent.propTypes = {
  prf_summary: PropTypes.shape({
    yearly_data: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        count: PropTypes.number.isRequired,
      })
    ),
    monthly_data: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.number.isRequired,
        total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        count: PropTypes.number.isRequired,
      })
    ),
  }),
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onYearChange: PropTypes.func.isRequired,
};

export default LineChartComponent;