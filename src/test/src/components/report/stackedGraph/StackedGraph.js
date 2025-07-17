import React, { useEffect, useState } from 'react';
import { chart, defaultOptions } from 'highcharts';
import {
  getLastThiryDaysDateStrings,
  getLastThirtyDaysViews,
} from '../../../core/helpers/report';

import './StackedGraph.scss';

const StackedGraph = ({ engagements, snippet }) => {
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
    chart(`stacked-chart-${snippet.value}`, {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Viewers (Last 30 Days)',
      },
      xAxis: {
        categories: getLastThiryDaysDateStrings(),
        crosshair: true,
      },
      yAxis: {
        title: {
          text: 'Views',
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      plotOptions: {
        series: {
          stacking: 'normal',
        },
      },
      credits: {
        enabled: false,
      },
      series: views,
    });

  return (
    <div className="stacked-chart">
      <div id={`stacked-chart-${snippet.value}`}></div>
    </div>
  );
};

export { StackedGraph };
