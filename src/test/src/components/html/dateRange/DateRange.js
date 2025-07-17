import React, { useEffect, useState } from 'react';
import { DatesRangeInput } from 'semantic-ui-calendar-react';

import './DateRange.scss';

const DateRange = (props) => {
 // console.log("dateRange",props)
  const { startDate: start, endDate: end, onChange } = props;
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (start || end) setDateRange(`${start} - ${end}`);
  }, [start, end]);

useEffect(() => {
    if (start=="" && end =="") setDateRange("");
  }, [start, end]);

  useEffect(() => {
    onChange({ startDate: startDate, endDate: endDate });
  }, [startDate, endDate]);

  const _onChange = (event, { name, value }) => {
    setDateRange(value);
    let [s, e] = value.split('-');
    setStartDate(s);
    setEndDate(e);
  };
//console.log("dateRange----",dateRange);
  return (
    <div className="date-range-cmp">
      {props.label ? (
        <label htmlFor={props.id}>{props.label}</label>
      ) : null}
      <DatesRangeInput
        name="dateRange"
        placeholder="From - To"
        dateFormat="DD/MM/YYYY"
        value={dateRange}
        iconPosition="left"
        onChange={_onChange}
        fluid={true}
      />
    </div>
  );
};

export { DateRange };