// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import LineChartComponent from '../components/LineChartComponent';
import BarChartComponent from '../components/BarChartComponent';
import PieChartComponent from '../components/PieChartComponent'; // Import PieChartComponent
import DoughnutChartComponent from '../components/DoughnutChartComponent'; // Import DoughnutChartComponent
// Import Chart.js modules
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { fetchCotDashboard, fetchPrfDashboard } from '../actions/dashboardActions';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

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
  const [selectedYears, setSelectedYears] = useState({
    order: 'all',
    declaration: 'all',
    checks: 'all',
    representation: 'all',
    cottageBarYear: 'all',
  });

  const [summaryData, setSummaryData] = useState({
    passed_checks_count: 0,
    unpassed_checks_count: 0,
    passed_checks_value: 0,
    unpassed_checks_value: 0,
    past_representations_count: 0,
    unpast_representations_count: 0,
  });

  const [dataType, setDataType] = useState('price'); // New state to toggle between price and count

  const dispatch = useDispatch();

  const handleYearChange = (cardType, year) => {
    setSelectedYears((prevSelectedYears) => ({
      ...prevSelectedYears,
      [cardType]: year,
    }));

    if (cardType === 'order') {
      dispatch(fetchPrfDashboard(year === 'all' ? 'all' : year));
    } else if (cardType === 'declaration') {
      dispatch(fetchCotDashboard(year === 'all' ? 'all' : year));
    }
  };

  // Fetch the summary data from the DRF view
  const fetchSummaryData = async () => {
    try {
      const response = await axiosInstance.get('/rep-dashboard/');  // Make sure this matches the URL for your DRF view
      const data = response.data;
      setSummaryData(data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  useEffect(() => {
    fetchSummaryData();

    dispatch(fetchPrfDashboard(selectedYears.order));
    dispatch(fetchCotDashboard(selectedYears.declaration));
  }, [dispatch, selectedYears.order, selectedYears.declaration]);

  const { passed_checks_count, unpassed_checks_count, passed_checks_value, unpassed_checks_value, past_representations_count, unpast_representations_count } = summaryData;

  // Checks Data for Pie Chart (Quantity vs Value)
  const checksData = {
    labels: ['چک‌های پاس‌شده', 'چک‌های پاس‌نشده'],
    datasets: [
      {
        label: dataType === 'price' ? 'آمار چک‌ها (بر اساس ارزش)' : 'آمار چک‌ها (بر اساس تعداد)',
        data: dataType === 'price'
          ? [passed_checks_value, unpassed_checks_value]
          : [passed_checks_count, unpassed_checks_count],
        backgroundColor: ['#2bb3cf', '#FF6384'],
        hoverBackgroundColor: ['#2bb3cf80', '#FF638480'],
      },
    ],
  };

  // Representation Doughnut Chart Data & Options
  const representationDoughnutData = {
    labels: ['وکالت فعال', 'وکالت غیرفعال'],
    datasets: [
      {
        data: [unpast_representations_count, past_representations_count], // Total representations are assumed to be 10 for now
        backgroundColor: ['#2bb3cf', '#FF6384'],
        hoverBackgroundColor: ['#2bb3cf80', '#FF638480'],
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

  const { prf_summary, cot_summary, loading, error } = useSelector((state) => state.dashboard);


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>داشبورد مدیریت</h1>
        <p>مروری سریع بر سامانه</p>
      </header>

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
          <BarChartComponent
            cot_summary={cot_summary}
            selectedYear={selectedYears.declaration}
            onYearChange={(year) => handleYearChange('declaration', year)}
          />
        </div>

        {/* Checks Card */}
        <div className="static-card">
          <h2>چک‌ها</h2>
          <div style={{ marginTop: '10px' }}>
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
          <ul>
            <li>تعداد کل چک‌ها: {passed_checks_count + unpassed_checks_count}</li>
          </ul>
          {/* PieChart Component */}
          <PieChartComponent data={checksData} />
          

        </div>

        {/* Representation Card */}
        <div className="static-card">
          <h2>وکالت</h2>

          <ul>
            <li>تعداد کل وکالت‌نامه‌ها: {past_representations_count + unpast_representations_count}</li>
          </ul>
          {/* DoughnutChartComponent */}
          <DoughnutChartComponent data={representationDoughnutData} options={representationDoughnutOptions} />
          <Link to="/representations" ><button className="action-btn">مشاهده وکالت‌نامه‌ها</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
