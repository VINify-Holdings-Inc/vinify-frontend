export const getQuery = (params) => {
  const {
    dateRange,
    timeRange,
    selectedClients,
    selectedCountries,
    selectedPlatforms,
    selectedDevices,
      ipAddress,
      receiver
  } = params;
  let query = '';

  if (dateRange) {
    if (dateRange.startDate) {
      query += `dateFrom=${dateRange.startDate}`;
    }
    if (dateRange.endDate) {
      query += `&&dateTill=${dateRange.endDate}`;
    }
  }

  if (timeRange) {
    if (timeRange.startTime) {
      query += `&&timeFrom=${timeRange.startTime}`;
    }
    if (timeRange.endTime) {
      query += `&&timeTill=${timeRange.endTime}`;
    }
  }

  if (selectedClients && selectedClients.length) {
    query += `&&clientscsv=${selectedClients.toString()}`;
  }

  if (selectedCountries && selectedCountries.length) {
    query += `&&country=${selectedCountries.toString()}`;
  }

  if (selectedPlatforms && selectedPlatforms.length) {
    query += `&&platformscsv=${selectedPlatforms.toString()}`;
  }

  if (selectedDevices && selectedDevices.length) {
    query += `&&devicescsv=${selectedDevices.toString()}`;
  }

  if (ipAddress) {
    query += `&&ipAddress=${ipAddress}`;
  }
    if (receiver) {
        query += `&&receiver=${receiver}`;
    }

  return query;
};
