// src/components/BarChartComponent.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import 'chart.js/auto'; // Ensure all necessary chart types are registered

const BarChartComponent = ({ cot_summary, selectedYear, onYearChange }) => {
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

  // State to track selected data type: 'value' or 'count'
  const [dataType, setDataType] = useState('value');

  // State to store total sum and count
  const [totalSum, setTotalSum] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (cot_summary) {
      if (selectedYear === 'all' && cot_summary.yearly_data) {
        const sum = cot_summary.yearly_data.reduce(
          (acc, item) => acc + parseFloat(item.total_price),
          0
        );
        const count = cot_summary.yearly_data.reduce(
          (acc, item) => acc + parseInt(item.count, 10),
          0
        );
        setTotalSum(sum);
        setTotalCount(count);
      } else if (cot_summary.monthly_data) {
        const sum = cot_summary.monthly_data.reduce(
          (acc, item) => acc + parseFloat(item.total_price),
          0
        );
        const count = cot_summary.monthly_data.reduce(
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
  }, [cot_summary, selectedYear]);

  const buildChartData = () => {
    if (!cot_summary) return { labels: [], datasets: [] };

    if (selectedYear === 'all' && cot_summary.yearly_data) {
      const labels = cot_summary.yearly_data.map((item) => item.year);
      const dataPoints = cot_summary.yearly_data.map((item) =>
        dataType === 'value' ? parseFloat(item.total_price) : item.count
      );

      return {
        labels,
        datasets: [
          {
            label:
              dataType === 'value'
                ? 'مجموع ارزش کوتاژها به تفکیک سال'
                : 'تعداد کوتاژها به تفکیک سال',
            data: dataPoints,
            backgroundColor:
              dataType === 'value'
                ? 'rgba(75, 192, 192, 0.6)'
                : 'rgba(255, 159, 64, 0.6)',
            borderColor:
              dataType === 'value'
                ? 'rgba(75, 192, 192, 1)'
                : 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    if (cot_summary.monthly_data) {
      const monthlyValues = Array(12).fill(0);
      cot_summary.monthly_data.forEach((item) => {
        const idx = item.month - 1;
        if (idx >= 0 && idx < 12) {
          monthlyValues[idx] =
            dataType === 'value' ? parseFloat(item.total_price) : item.count;
        }
      });

      return {
        labels: jalaliMonths,
        datasets: [
          {
            label:
              dataType === 'value'
                ? `مجموع ارزش کوتاژها در سال ${selectedYear}`
                : `تعداد کوتاژها در سال ${selectedYear}`,
            data: monthlyValues,
            backgroundColor:
              dataType === 'value'
                ? 'rgba(153, 102, 255, 0.6)'
                : 'rgba(54, 162, 235, 0.6)',
            borderColor:
              dataType === 'value'
                ? 'rgba(153, 102, 255, 1)'
                : 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
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
            ? dataType === 'value'
              ? 'مجموع ارزش کوتاژها به تفکیک سال'
              : 'تعداد کوتاژها به تفکیک سال'
            : dataType === 'value'
            ? `مجموع ارزش کوتاژها در سال ${selectedYear}`
            : `تعداد کوتاژها در سال ${selectedYear}`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (dataType === 'value') {
                label += context.parsed.y.toLocaleString() + 'یورو';
              } else {
                label += context.parsed.y.toLocaleString() + ' کوتاژ';
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
          callback: function (value) {
            return dataType === 'value'
              ? value.toLocaleString() + 'یورو'
              : value.toLocaleString() + ' کوتاژ';
          },
        },
        title: {
          display: true,
          text: dataType === 'value' ? 'ارزش (یورو)' : 'تعداد کوتاژها',
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
    <div className="bar-chart-container">
      {/* Year Selector */}
      <div className="card-year-selector" style={{ marginBottom: '20px' }}>
        <label htmlFor="bar-year-selector">انتخاب سال:</label>
        <select
          id="bar-year-selector"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="all">همه سال‌ها</option>
          {cot_summary?.yearly_data?.map((item) => (
            <option key={item.year} value={item.year}>
              {item.year}
            </option>
          ))}
        </select>
      </div>

      {/* Data Type Selector */}
      <div className="data-type-selector" style={{ marginBottom: '20px' }}>
        <label>نمایش داده‌ها:</label>
        <button
          onClick={() => setDataType('value')}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: dataType === 'value' ? '#4bc0c0' : '#e0e0e0',
            color: dataType === 'value' ? '#fff' : '#000',
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

      {/* Display the total sum or count based on data type */}
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        {dataType === 'value' ? (
          <>
            مجموع ارزش کوتاژها: {totalSum.toLocaleString()}یورو
          </>
        ) : (
          <>
            تعداد کوتاژها: {totalCount.toLocaleString()} کوتاژ
          </>
        )}
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>داده‌ای برای نمایش وجود ندارد.</p>
        )}
      </div>
    </div>
  );
};

// Adding PropTypes for better type checking
BarChartComponent.propTypes = {
  cot_summary: PropTypes.shape({
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

export default BarChartComponent;
