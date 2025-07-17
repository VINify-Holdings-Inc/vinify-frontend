import React from 'react';
import './Loading.scss';

const Loading = props => {
  return props.center ? (
    <div className='text-center'>
      <div className='lds-ellipsis text-center'>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  ) : (
    <div className='lds-ellipsis text-center'>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export { Loading };
