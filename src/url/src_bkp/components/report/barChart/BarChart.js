import React, { useEffect, useState } from 'react';
import { chart, defaultOptions } from 'highcharts';
import './BarChart.scss';
import {
  getLastThiryDaysDateStrings,
  getLastThirtyDaysViews,
} from '../../../core/helpers/report';

const BarChart = ({ engagements, snippet }) => {
  const [views, setViews] = useState([]);

  useEffect(() => {
    if (engagements && engagements.length) {
      updateViews();
    }
  }, [engagements]);

  useEffect(() => {
    createChart();
  }, [views]);

  const updateViews = () => {
    setViews(getLastThirtyDaysViews(engagements));
  };

  const createChart = () =>
    chart(`bar-chart-${snippet.value}`, {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Viewers (Last 30 Days)',
      },
      xAxis: {
        title: {
          text: 'Days',
        },
        categories: getLastThiryDaysDateStrings(),
        crosshair: true,
      },
      yAxis: {
        title: {
          text: 'Views',
        },
      },
      credits: {
        enabled: false,
      },
      series: views,
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
    });

  return (
    <div className="bar-chart">
      <div id={`bar-chart-${snippet.value}`}></div>
    </div>
  );
};

export { BarChart };
