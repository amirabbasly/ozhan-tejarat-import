// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import LineChartComponent from '../components/LineChartComponent';
import BarChartComponent from '../components/BarChartComponent'; // Import the new component

// Import the chart components and Chart.js modules
import { Pie, Doughnut } from 'react-chartjs-2';
import {
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
import {fetchCotDashboard, fetchPrfDashboard } from '../actions/dashboardActions'

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
    order: 'all',
    declaration: 'all',
    checks: 'all',
    representation: 'all',
    cottageBarYear: 'all',
  });

  const dispatch = useDispatch();

  const handleYearChange = (cardType, year) => {
    setSelectedYears((prevSelectedYears) => ({
      ...prevSelectedYears,
      [cardType]: year,
    }));

    // Dispatch different actions based on cardType
    if (cardType === 'order') {
      dispatch(fetchPrfDashboard(year === 'all' ? 'all' : year));
    } else if (cardType === 'declaration') {
      dispatch(fetchCotDashboard(year === 'all' ? 'all' : year));
    }
    // Add more conditions if you have other cardTypes
  };

  useEffect(() => {
    // Initial data fetch for all cards
    dispatch(fetchPrfDashboard(selectedYears.order));
    dispatch(fetchCotDashboard(selectedYears.declaration));
    // Dispatch other actions if needed
  }, [dispatch, selectedYears.order, selectedYears.declaration]);

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

  const { prf_summary, cot_summary, loading, error } = useSelector(
    (state) => state.dashboard
  );

  // Representation Doughnut Chart Data & Options
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

  const years = prf_summary?.yearly_data?.map((item) => item.year) || [];

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

          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>خطا: {error}</p>
          ) : (
            <LineChartComponent
              prf_summary={prf_summary}
              selectedYear={selectedYears.order}
              onYearChange={(year) => handleYearChange('order', year)}
            />
          )}
        </div>

        {/* Declaration Card */}
        <div className="static-card">
          <h2>اظهارنامه</h2>
          {/* Integrate the BarChartComponent */}
          <BarChartComponent
            cot_summary={cot_summary}
            selectedYear={selectedYears.declaration}
            onYearChange={(year) => handleYearChange('declaration', year)}
          />

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
              <option value="all">همه سال‌ها</option>

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
          <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
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
              <option value="all">همه سال‌ها</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <p>وکالت‌نامه‌های سال {selectedYears.representation}</p>
          <ul>
            <li>تعداد کل وکالت‌نامه‌ها: 10</li>
          </ul>

          {/* Doughnut Chart for وکالت‌نامه‌ها */}
          <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
            <Doughnut data={representationDoughnutData} options={representationDoughnutOptions} />
          </div>

          <button className="action-btn">مشاهده وکالت‌نامه‌ها</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
