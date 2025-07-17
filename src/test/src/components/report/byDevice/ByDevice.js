import React, { useEffect, useState } from 'react';
import { Icon } from '../../html';

import {
  getDesktopViewPercentage,
  getMobileViewPercentage,
} from '../../../core/helpers/report';

import './ByDevice.scss';

const ByDevice = ({ engagements, snippet, name }) => {
  const [mobileViewPercentage, setMobileViewPercentage] = useState(0);
  const [desktopViewPercentage, setDesktopViewPercentage] = useState(0);

  useEffect(() => {
    if (engagements && engagements.length) {
      getMobileView();
      getDesktopView();
    }
  }, [engagements]);

  const getMobileView = () => {
    setMobileViewPercentage(getMobileViewPercentage(engagements));
  };

  const getDesktopView = () => {
    setDesktopViewPercentage(getDesktopViewPercentage(engagements));
  };

  return (
    <div className="by-device">
      <h3 className="title">Engagement By Device</h3>
      <hr />
      <div className="detail">
        <Icon icon="mobile-alt" size={1.8} />
        <span className="per">{`${mobileViewPercentage}%`}</span>
        <span>Mobile</span>
      </div>
      <hr />
      <div className="detail">
        <Icon icon="desktop" size={1.8} />
        <span className="per">{`${desktopViewPercentage}%`}</span>
        <span>Desktop</span>
      </div>
    </div>
  );
};

export { ByDevice };
