import React, { useEffect, useState } from 'react';
import {
  getClickCount,
  getClickPercentage,
  getOpenCount,
  getOpenPercentage,
} from '../../../core/helpers/report';

import './PercentageDisplay.scss';

const PercentageDisplay = ({ engagements, snippet, name }) => {
  const [percentage, setPercentage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (engagements && engagements.length) {
      getPercentage();
      getCount();
    }
  }, [engagements]);

  const getPercentage = () => {
    if (name === 'open') {
      setPercentage(getOpenPercentage(engagements));
    } else {
      setPercentage(getClickPercentage(engagements));
    }
  };

  const getCount = () => {
    if (name === 'open') {
      setCount(getOpenCount(engagements));
    } else {
      setCount(getClickCount(engagements));
    }
  };

  return (
    <div className="percentage-display">
      <h3 className="title">{`${name}s`}</h3>
      <h3 className="value">{`${percentage}%`}</h3>
      <p>
        <b>{count}</b>
        &nbsp;
        {`${name}s`}
      </p>
    </div>
  );
};

export { PercentageDisplay };
