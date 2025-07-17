import React, { Component } from 'react';
import { Icon } from '../../html';

// import './Breadcrumb.scss';

const Breadcrumb = props => {
  // Utils

  const getHomeLink = () => (
    <a href='/'>
      <Icon icon='home' /> Home&nbsp;
    </a>
  );

  const getModuleLink = () =>
    props.module.isHome ? null : props.page.isIndex ? (
      <span>/&nbsp;{props.module.name}&nbsp;</span>
    ) : (
      <a href={props.module.url}>/&nbsp;{props.module.name}&nbsp;</a>
    );

  const getPageLink = () =>
    props.page.isIndex ? null : props.action ? (
      <a href={props.page.url}>/&nbsp;{props.page.name}&nbsp;</a>
    ) : (
      <span>/&nbsp;{props.page.name}&nbsp;</span>
    );

  const getActionLink = () =>
    props.action ? <span>/&nbsp;{props.action.name}&nbsp;</span> : null;

  // Render

  return (
    <div className='breadcrumb-top'>
      <ul>
        <li>{getHomeLink()}</li>
        <li>{getModuleLink()}</li>
        <li>{getPageLink()}</li>
        <li>{getActionLink()}</li>
      </ul>
    </div>
  );
};

export { Breadcrumb };
