// src/components/DoughnutChartComponent.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

// DoughnutChart component for representations
const DoughnutChartComponent = ({ data, options }) => {
  return (
    <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChartComponent;
