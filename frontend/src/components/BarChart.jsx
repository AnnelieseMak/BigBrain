import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const BarChart = ({ chartData, options }) => {
  console.log('BAR CHART');
  return (
    <Box>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

BarChart.propTypes = {
  chartData: PropTypes.object,
  options: PropTypes.object,
};

export default BarChart;
