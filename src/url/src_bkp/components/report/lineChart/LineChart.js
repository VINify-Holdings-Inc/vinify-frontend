import React, { useEffect, useState } from 'react';
import { chart } from 'highcharts';
import {
  getCurrentMonthName,
  getLastTwelveMonthlyCounts,
  getLastTwelveMonthsStringsWithYear,
  getPreviousSevenDates,
  getLastTwelveMonthlyCountsDurationSecClick,
} from '../../../core/helpers/report';

import './LineChart.scss';
import { Select } from '../../html';
import { Button, Icon } from 'semantic-ui-react';

const lineChartFilterOptions = [
  {
    text: 'This Week',
    value: 'current-week'
  }, {
    text: 'This Month',
    value: 'current-month'
  }, {
    text: 'Past 3 months',
    value: '3-months'
  },
]

const LineChart = ({ engagements, snippet }) => {
  const [filterStartDate, setFilterStartDate] = useState(new Date());
  const [clickViews, setClickViews] = useState([]);
  const [openViews, setOpenViews] = useState([]);

  const filterEndDate = new Date(filterStartDate);
  filterEndDate.setDate(filterEndDate.getDate() - 7);

  useEffect(() => {
    if (engagements && engagements.length) {
      updateViews();
    }
  }, [engagements, filterStartDate]);

  useEffect(() => {
    createChart();
  }, [clickViews, openViews]);

  const updateViews = () => {
   // setClickViews(getLastTwelveMonthlyCounts(filterStartDate, engagements, 'click'));
    setClickViews(getLastTwelveMonthlyCountsDurationSecClick(filterStartDate, engagements, 'click'));
    setOpenViews(getLastTwelveMonthlyCounts(filterStartDate, engagements, 'view'));
  };

  const createChart = () =>
    chart(`line-chart-${snippet.value}`, {
      chart: {
        backgroundColor: 'transparent',
      },
      title: {
        text: '',
      },

      yAxis: {
        title: {
          text: 'Number of Engagements',
        },
      },

      xAxis: {
        title: {
          text: 'Months',
        },
        categories: getPreviousSevenDates(filterStartDate).map(date => date.toDateString()),
        // accessibility: {
        //   rangeDescription: `Range: ${getCurrentMonthName()}, ${new Date().getFullYear() - 1
        //     } to ${getCurrentMonthName()}, ${new Date().getFullYear()}`,
        // },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      series: [
        {
          name: 'Clicks',
          data: clickViews,
          color: '#e00000'
        },
        {
          name: 'Views',
          data: openViews,
          color: '#1520A6'
        },
      ],
      credits: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    });

  return (
    <div className="px-8 py-4">
      <div className='flex flex-wrap justify-between items-center mt-4 mb-6'>
        <h2 className='text-light-rose-dark text-base'>Engagement Timeline</h2>
        <Button.Group>
          <Button icon onClick={() => {
            const temp = new Date(filterStartDate);
            temp.setDate(temp.getDate() - 7);
            setFilterStartDate(temp);
          }}>
            <Icon name='left arrow' />
          </Button>
          <Button disabled>{filterEndDate.toDateString()} ~ {filterStartDate.toDateString()}</Button>
          <Button disabled={filterStartDate.toDateString() == new Date().toDateString()} icon onClick={() => {
            const temp = new Date(filterStartDate);
            temp.setDate(temp.getDate() + 7);
            setFilterStartDate(temp);
          }}>
            <Icon name='right arrow' />
          </Button>
        </Button.Group>
      </div>
      <div id={`line-chart-${snippet.value}`}></div>
    </div>
  );
};

export { LineChart };
