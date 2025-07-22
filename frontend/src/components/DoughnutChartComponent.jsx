// // src/components/DoughnutChartComponent.jsx
// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';

// // DoughnutChart component for representations
// const DoughnutChartComponent = ({ data, options }) => {
//   return (
//     <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
//       <Doughnut data={data} options={options} />
//     </div>
//   );
// };

// export default DoughnutChartComponent;


import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import 'chart.js/auto';

const DoughnutChartComponent = ({ data, options }) => {
  return (
    <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

DoughnutChartComponent.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
        hoverBackgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
  }).isRequired,
  options: PropTypes.object,
};

export default DoughnutChartComponent;