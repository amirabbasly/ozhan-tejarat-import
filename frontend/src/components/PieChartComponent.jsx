// // src/components/PieChartComponent.jsx
// import React from 'react';
// import { Pie } from 'react-chartjs-2';

// // PieChart component for checks
// const PieChartComponent = ({ data }) => {
//   return (
//     <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
//       <Pie data={data} />
//     </div>
//   );
// };

// export default PieChartComponent;




import React from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import 'chart.js/auto';

const PieChartComponent = ({ data }) => {
  return (
    <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
      <Pie data={data} />
    </div>
  );
};

PieChartComponent.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
        hoverBackgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default PieChartComponent;