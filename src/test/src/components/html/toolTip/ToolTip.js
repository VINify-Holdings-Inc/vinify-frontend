import React from 'react';

import './ToolTip.scss';

const ToolTip = props => {
  return (
    <div className={`cmp-tool-tip ${props.position}`}>
      <p className='message'>{props.dataContent}</p>
      <div className='tail-shadow'></div>
      <div className='tail'></div>
      <div className='tail-overlay'></div>
    </div>
  );
};

ToolTip.defaultProps = {
  position: 'left'
};

export { ToolTip };
