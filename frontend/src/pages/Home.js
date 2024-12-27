import React, { useState } from 'react';
import './Home.css';

// 1) Import the chart components and Chart.js modules
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';

// 2) Register Chart.js components

ChartJS.register(
        ArcElement,
        Tooltip,
        Legend,
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        PointElement,
        LineElement
      );

const Home = () => {
  // Store the selected year for each card
  const [selectedYears, setSelectedYears] = useState({
    order: new Date().getFullYear(),
    declaration: new Date().getFullYear(),
    checks: new Date().getFullYear(),
    representation: new Date().getFullYear(),
    cottageBarYear: new Date().getFullYear(),
  });

  // Handle year change for a specific card
  const handleYearChange = (cardKey, year) => {
    setSelectedYears((prev) => ({
      ...prev,
      [cardKey]: year,
    }));
  };

  // Pie chart data for Checks (example)
  const checksData = {
    labels: ['چک‌های پاس‌شده', 'چک‌های پاس‌نشده'],
    datasets: [
      {
        label: 'آمار چک‌ها',
        data: [15, 8],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB80', '#FF638480'],
      },
    ],
  };

  // Jalali months array
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

  // Example: Line chart data for "Orders" - total value each month
  const ordersLineData = {
    labels: jalaliMonths,
    datasets: [
      {
        label: 'ارزش سفارش‌ها',
        data: [1200, 2000, 1700, 2200, 3200, 2800, 3900, 4200, 3600, 3000, 2500, 4100],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2,
      },
    ],
  };

  const ordersLineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `ارزش سفارش‌ها در سال ${selectedYears.order}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Bar chart data & options for “Cottages”
  const barData = {
    labels: jalaliMonths,
    datasets: [
      {
        label: 'مجموع ارزش کوتاژها',
        data: [120, 90, 150, 80, 100, 160, 140, 200, 180, 75, 60, 95],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `مجموع ارزش کوتاژها در سال ${selectedYears.cottageBarYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
    const representationDoughnutData = {
    labels: ['وکالت فعال', 'وکالت غیرفعال'],
    datasets: [
      {
        data: [7, 3],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB80', '#FF638480'],
      },
    ],
  };

  const representationDoughnutOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'وکالت‌نامه‌ها (فعال در مقابل غیرفعال)',
      },
    },
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>داشبورد مدرن</h1>
        <p>مروری سریع بر سامانه</p>
      </header>

      {/* Cards Section */}
      <div className="cards-container">
        {/* Order Card */}
        <div className="static-card">
          <h2>ثبت سفارش</h2>
          <div className="card-year-selector">
            <label htmlFor="order-year">انتخاب سال:</label>
            <select
              id="order-year"
              value={selectedYears.order}
              onChange={(e) => handleYearChange('order', e.target.value)}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <p>سفارش‌های سال {selectedYears.order}</p>
          <ul>
            <li>تعداد کل سفارش‌ها: 150</li>
            <li>ارزش کل سفارش‌ها: 12,500,000 ریال</li>
          </ul>

          {/* Add the Line chart for monthly order values */}
          <div style={{ width: '400px', margin: '20px auto' }}>
            <Line data={ordersLineData} options={ordersLineOptions} />
          </div>

          <button className="action-btn">مشاهده سفارش‌ها</button>
        </div>

        {/* Checks Card */}
        <div className="static-card">
          <h2>چک‌ها</h2>
          <div className="card-year-selector">
            <label htmlFor="checks-year">انتخاب سال:</label>
            <select
              id="checks-year"
              value={selectedYears.checks}
              onChange={(e) => handleYearChange('checks', e.target.value)}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <p>چک‌های سال {selectedYears.checks}</p>
          <ul>
            <li>تعداد کل چک‌ها: 23</li>
          </ul>
          <div style={{ width: '200px', margin: 'auto' }}>
            <Pie data={checksData} />
          </div>
          <button className="action-btn">مشاهده چک‌ها</button>
        </div>

        {/* Representation Card */}
        <div className="static-card">
          <h2>وکالت</h2>
          <div className="card-year-selector">
            <label htmlFor="representation-year">انتخاب سال:</label>
            <select
              id="representation-year"
              value={selectedYears.representation}
              onChange={(e) => handleYearChange('representation', e.target.value)}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <p>وکالت‌نامه‌های سال {selectedYears.representation}</p>
          <ul>
            <li>تعداد کل وکالت‌نامه‌ها: 10</li>
          </ul>

          {/* Doughnut Chart for وکالت‌نامه‌ها */}
          <div style={{ width: '200px', margin: 'auto' }}>
            <Doughnut data={representationDoughnutData} options={representationDoughnutOptions} />
          </div>

          <button className="action-btn">مشاهده وکالت‌نامه‌ها</button>
        </div>
        
        {/* Declaration Card */}
        <div className="static-card">
          <h2>اظهارنامه</h2>
          <div className="card-year-selector">
            <label htmlFor="declaration-year">انتخاب سال:</label>
            <select
              id="declaration-year"
              value={selectedYears.declaration}
              onChange={(e) => handleYearChange('declaration', e.target.value)}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <p>اظهارنامه‌های سال {selectedYears.declaration}</p>
          <ul>
            <li>تعداد کل اظهارنامه‌ها: 75</li>
            <li>ارزش کل: 8,300,000 ریال</li>
          </ul>

          {/* Move the Bar Chart here */}
          <div style={{ margin: '20px auto', width: '100%' }}>
            <div className="card-year-selector" style={{ marginBottom: '10px' }}>

            </div>
            <div style={{ width: '600px', margin: 'auto' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          
          <button className="action-btn">مشاهده اظهارنامه‌ها</button>
        </div>

      </div>
    </div>
  );
};

export default Home;
