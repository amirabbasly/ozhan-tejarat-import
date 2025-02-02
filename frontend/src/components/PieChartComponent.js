// src/components/PieChartComponent.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';

// PieChart component for checks
const PieChartComponent = ({ data }) => {
  return (
    <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
      <Pie data={data} />
    </div>
  );
};

export default PieChartComponent;
