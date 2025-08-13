import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import {
  getClickCount,
  getClickTodayCount,
  getOpenCount,
  getOpenTodayCount,
  getTotalCount,
  getTotalMonthCount,
  getTotalTodayCount,
  getOpenMonthCount,
  getClickMonthCount,
} from '../../../core/helpers/report';

import './CampaignMonitorList.scss';

const CampaignMonitorList = ({ engagements, snippet }) => {
  useEffect(() => {
    getTotalMonthCount(engagements);
  }, [engagements]);
  return (
    <div className="campaign-monitor-list">
      {/* <h3 className="title">Campaign Monitor List</h3>
      <p className="sub-title">
        List:&nbsp;<b>{snippet.text}</b>
      </p> */}
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>Total Engagements</Grid.Column>
          <Grid.Column>Opens</Grid.Column>
          <Grid.Column>Clicks</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>Today</Grid.Column>
          <Grid.Column>
            <b>{getTotalTodayCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getOpenTodayCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getClickTodayCount(engagements)}</b>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>This month</Grid.Column>
          <Grid.Column>
            <b>{getTotalMonthCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getOpenMonthCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getClickMonthCount(engagements)}</b>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>Total</Grid.Column>
          <Grid.Column>
            <b>{getTotalCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getOpenCount(engagements)}</b>
          </Grid.Column>
          <Grid.Column>
            <b>{getClickCount(engagements)}</b>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export { CampaignMonitorList };
