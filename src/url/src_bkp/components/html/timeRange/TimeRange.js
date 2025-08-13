import React, { useEffect, useState } from 'react';

import { TimeInput } from 'semantic-ui-calendar-react';

import './TimeRange.scss';

const TimeRange = ({ startTime: start, endTime: end, onChange }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    onChange({ startTime: startTime, endTime: endTime });
  }, [startTime, endTime]);

  useEffect(() => {
    setStartTime(start);
    setEndTime(end);
  }, [start, end]);

  const handleChange = (e, { name, value }) => {
    if (name === 'StartTime') {
      setStartTime(value);
    }
    if (name === 'EndTime') {
      setEndTime(value);
    }
  };

  return (
    <div className="time-range-cmp">
      <TimeInput
        fluid={true}
        name="StartTime"
        placeholder="Start Time"
        value={startTime}
        iconPosition="left"
        onChange={handleChange}
      />
      <TimeInput
        fluid={true}
        name="EndTime"
        placeholder="End Time"
        value={endTime}
        iconPosition="left"
        onChange={handleChange}
      />
    </div>
  );
};

export { TimeRange };