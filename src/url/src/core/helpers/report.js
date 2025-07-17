import axios from 'axios';
import fileDownload from 'js-file-download';
export const getTotalCount = (engagements) => {
  return engagements.length;
};

export const getOpenCount = (engagements) => {
  return engagements.filter((engagement) => engagement.activity === 'view')// || engagement.activity === 'web-view')
    .length;
};

export const getOpenUniqueCount = (engagements) => {
  return engagements.filter(
    (engagement) =>
      engagement.activity === 'view' && engagement.isUnique === true
  ).length;
};

export const getOpenNonUniqueCount = (engagements) => {
  return engagements.filter(
    (engagement) =>
      engagement.activity === 'view' && engagement.isUnique === false
  ).length;
};

export const getClickCount = (engagements) => {
  return engagements.filter((engagement) => engagement.activity === 'click')
    .length;
};

export const getClickNewCount = (engagements) => {
   
    return engagements
      .filter((e) => e.durationSecs >1 )
      .map((engagement) => engagement.durationSecs).length;
};

export const getClickUniqueCount = (engagements) => {
  return engagements.filter(
    (engagement) =>
      engagement.activity === 'click' && engagement.isUnique === true
  ).length;
};

export const getClickNonUniqueCount = (engagements) => {
  return engagements.filter(
    (engagement) =>
      engagement.activity === 'click' && engagement.isUnique === false
  ).length;
};

export const getTotalTodayCount = (engagements) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  return engagements.filter((engagement) => {
    const { date: dateString } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  }).length;
};

export const getOpenTodayCount = (engagements) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  return engagements.filter((engagement) => {
    const { date: dateString, activity } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate && activity === 'view';
  }).length;
};

export const getClickTodayCount = (engagements) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  return engagements.filter((engagement) => {
    const { date: dateString, activity } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate && activity === 'click';
  }).length;
};

export const getTotalMonthCount = (engagements) => {
  var currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return engagements.filter((engagement) => {
    const { date: dateString } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  }).length;
};

export const downloadFile = async (url, filename) => {
  return await axios.get(url, { responseType: 'blob' }).then((res) => {
    fileDownload(res.data, filename);
    return true;
  });
};

export const getOpenMonthCount = (engagements) => {
  var currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return engagements.filter((engagement) => {
    const { date: dateString, activity } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate && activity === 'view';
  }).length;
};

export const getClickMonthCount = (engagements) => {
  var currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return engagements.filter((engagement) => {
    const { date: dateString, activity } = engagement;
    const date = new Date(dateString);
    return date >= startDate && date <= endDate && activity === 'click';
  }).length;
};

export const getEngagementCountByDateAndActivityCount = (
  engagements,
  date,
  activity
) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  return engagements.filter((engagement) => {
    const { date: dateString, activity: act } = engagement;
    const cmpDate = new Date(dateString);
    return cmpDate.getTime() == startDate.getTime() && act === activity;
  }).length;
};


export const getEngagementCountByDateAndDurationSecsCount = (
  engagements,
  date,
  activity
) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  return engagements.filter((engagement) => {
    const { date: dateString, activity: act } = engagement;
    const cmpDate = new Date(dateString);
    return cmpDate.getTime() == startDate.getTime() && engagement.durationSecs > 1;
  }).length;
};

export const getMonthlyViews = (engagements) => {
  const monthDates = getCurrentMonthDates();
  var currentDate = new Date();
  const series = [
    { name: 'Open', data: [] },
    { name: 'Click', data: [] },
  ];
  monthDates.forEach((date) => {
    const dateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    series[0].data.push(
      getEngagementCountByDateAndActivityCount(engagements, dateObj, 'click')
    );
    series[1].data.push(
      getEngagementCountByDateAndActivityCount(engagements, dateObj, 'view')
    );
  });
  return series;
};

export const getLastThirtyDaysViews = (engagements) => {
  const lastThirtyDates = getLastThirtyDaysDates();
  const series = [
    { name: 'Click', data: [] },
    { name: 'Open', data: [] },
  ];
  lastThirtyDates.forEach((date) => {
    series[0].data.push(
      getEngagementCountByDateAndActivityCount(engagements, date, 'click')
    );
    series[1].data.push(
      getEngagementCountByDateAndActivityCount(engagements, date, 'view')
    );
  });
  return series;
};

export const getCurrentMonthName = () =>
  new Date().toLocaleString('default', { month: 'long' });

export const getMonthName = (date) =>
  date.toLocaleString('default', { month: 'long' });

export const getStartDateOfCurrentMonth = () => {
  var currentDate = new Date();
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};

export const getStartDateOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndDateOfCurrentMonth = () => {
  var currentDate = new Date();
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
};

export const getEndDateOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getCurrentMonthDates = () => {
  const startDate = getStartDateOfCurrentMonth();

  const endDate = getEndDateOfCurrentMonth();

  let dateArr = [];
  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    dateArr.push(i);
  }
  return dateArr;
};

export const getLastThirtyDaysDates = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  let dateArr = [];
  for (let i = 1; i <= 30; i++) {
    dateArr.push(new Date(date));
    date.setDate(date.getDate() - 1);
  }
  return dateArr.reverse();
};

export const getCurrentMonthDateStrings = () => {
  const startDate = getStartDateOfCurrentMonth();

  const endDate = getEndDateOfCurrentMonth();

  let dateArr = [];
  const month = getCurrentMonthName();
  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    dateArr.push(`${month} ${i}`);
  }
  return dateArr;
};

export const getLastThiryDaysDateStrings = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  let dateArr = [];
  for (let i = 1; i <= 30; i++) {
    const month = getMonthName(date);
    dateArr.push(`${month} ${date.getDate()}`);
    date.setDate(date.getDate() - 1);
  }
  return dateArr.reverse();
};

export const getOpenPercentage = (engagements) => {
  return Math.floor(
    (getOpenCount(engagements) / getTotalCount(engagements)) * 100,
    2
  );
};

export const getOpenUniquePercentage = (engagements) => {
  return Math.floor(
    (getOpenUniqueCount(engagements) / getTotalCount(engagements)) * 100,
    2
  );
};

export const getOpenNonUniquePercentage = (engagements) => {
  return Math.floor(
    (getOpenNonUniqueCount(engagements) / getTotalCount(engagements)) * 100,
    2
  );
};

export const getClickPercentage = (engagements) => {
  return Math.floor(
    (getClickCount(engagements) / getTotalCount(engagements)) * 100,
    2
  );
};

export const getClickPercentageBasedOnDurationSec = (engagements) => {
  return Math.floor(
    (getClickNewCount(engagements) / getTotalCount(engagements)) * 100,
    2
  );
};

export const getMobileViewCount = (engagements) => {
  return engagements.filter(
    (engagement) =>
      mobileDevices.indexOf(
        engagement.device && engagement.device.toLowerCase()
      ) !== -1
  ).length;
};

export const getDesktopViewCount = (engagements) => {
  return getTotalCount(engagements) - getMobileViewCount(engagements);
};

export const getMobileViewPercentage = (engagements) => {
  return (
    (getMobileViewCount(engagements) / getTotalCount(engagements)) *
    100
  ).toFixed(1);
};

export const getDesktopViewPercentage = (engagements) => {
  return (
    (getDesktopViewCount(engagements) / getTotalCount(engagements)) *
    100
  ).toFixed(1);
};

export const mobileDevices = ['ios', 'android'];
export const desktopDevices = ['windows', 'linux', 'window', 'osx'];

export const getPreviousSevenDates = (startDate) => {
  const date = new Date(startDate);
  date.setHours(0, 0, 0, 0);

  let dateArr = [];

  for (let i = 0; i < 7; i++) {
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() - i);
    dateArr.push(tempDate);
  }

  return dateArr.reverse();
}

export const getLastTwelveMonthsDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  let dateArr = [];
  for (let i = 0; i <= 11; i++) {
    let tempDate = new Date(date);
    tempDate.setMonth(date.getMonth() - i);
    dateArr.push(tempDate);
  }
  return dateArr.reverse();
};

export const getLastTwelveMonthsStringsWithYear = () => {
  const date = new Date();
  // date.setHours(0, 0, 0, 0);

  let dateArr = [];
  // for (let i = 0; i <= 11; i++) {
  //   let tempDate = new Date(date);
  //   tempDate.setMonth(date.getMonth() - i);
  //   dateArr.push(`${getMonthName(tempDate)}, ${tempDate.getFullYear()}`);
  // }
  // return dateArr.reverse();

  for (let i = 0; i < 7; i++) {
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() - i);
    dateArr.push(`${tempDate.toDateString()}`);
  }

  return dateArr.reverse();
};

export const getLastTwelveMonthlyCounts = (startDate, engagements, activity) => {
  // const lastMonths = getLastTwelveMonthsDate();
  let counts = [];
  // lastMonths.forEach((date) => {
  //   counts.push(getMonthlyViewsByActivity(engagements, date, activity));
  // });
  // return counts;

  const dates = getPreviousSevenDates(startDate);
  dates.forEach(date => {
    counts.push(getEngagementCountByDateAndActivityCount(engagements, date, activity));
  });
  return counts;
};

export const getLastTwelveMonthlyCountsDurationSecClick = (startDate, engagements, activity) => {
  // const lastMonths = getLastTwelveMonthsDate();
  let counts = [];
  // lastMonths.forEach((date) => {
  //   counts.push(getMonthlyViewsByActivity(engagements, date, activity));
  // });
  // return counts;

  const dates = getPreviousSevenDates(startDate);
  dates.forEach(date => {
    counts.push(getEngagementCountByDateAndDurationSecsCount(engagements, date, activity));
  });
  return counts;
};

export const getMonthlyViewsByActivity = (engagements, date, activity) => {
  let startDate = getStartDateOfMonth(date);
  let endDate = getEndDateOfMonth(date);

  return getEngagementCountByDateRangeAndActivityCount(
    engagements,
    startDate,
    endDate,
    activity
  );
};

export const getEngagementCountByDateRangeAndActivityCount = (
  engagements,
  startDate,
  endDate,
  activity
) => {
  return engagements.filter((engagement) => {
    const { date: dateString, activity: act } = engagement;
    const cmpDate = new Date(dateString);
    return (
      cmpDate.getTime() >= startDate.getTime() &&
      cmpDate.getTime() <= endDate.getTime() &&
      act === activity
    );
  }).length;
};

export const activities = {
  view: 'view',
  open: 'view',
  click: 'click',
  webView: 'web-view',
};
