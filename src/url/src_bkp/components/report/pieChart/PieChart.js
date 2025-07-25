import React, { useEffect, useState } from 'react';
import Highcharts, { chart } from 'highcharts';
import {
  getClickPercentage,
  getOpenNonUniquePercentage,
  getOpenUniquePercentage,
  getOpenPercentage,
  getClickPercentageBasedOnDurationSec,
} from '../../../core/helpers/report';

import './PieChart.scss';

const PieChart = ({ engagements, snippet }) => {
  const [clickViewsPer, setClickViewsPer] = useState(0);
  const [openUniqueViewsPer, setOpenUniqueViewsPer] = useState(0);
  const [openNonUniqueViewsPer, setOpenNonUniqueViewsPer] = useState(0);

  useEffect(() => {
    if (engagements && engagements.length) {
      updateViews();
    }
  }, [engagements]);

  useEffect(() => {
    createChart();
  }, [clickViewsPer, openUniqueViewsPer, openNonUniqueViewsPer]);

  const updateViews = () => {
//    setClickViewsPer(getClickPercentage(engagements));  
    setClickViewsPer(getClickPercentageBasedOnDurationSec(engagements));  
    setOpenUniqueViewsPer(getOpenUniquePercentage(engagements));
    setOpenNonUniqueViewsPer(getOpenPercentage(engagements));
  };

  const createChart = () =>
    chart(`pie-chart-${snippet.value}`, {
      chart: {
        backgroundColor: 'transparent',
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: '',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          colors: [
            '#e00000',
            '#1520A6',
          ],
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: 'Percentage',
          data: [
            [`Clicks`, clickViewsPer],
            [`Views`, openNonUniqueViewsPer],
          ],
        },
      ],
    });

  return (
    <div className="px-8 py-6">
      <h2 className='text-light-rose-dark text-base'>Engagement Breakdown</h2>
      <div className="pie-chart">
        <div id={`pie-chart-${snippet.value}`}></div>
      </div>
    </div>
  );
};

export { PieChart };
