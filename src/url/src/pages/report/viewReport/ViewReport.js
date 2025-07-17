import React, { useEffect, useState } from "react";
import moment from "moment";
import { Grid, Accordion, Icon, Menu, Dropdown } from "semantic-ui-react";
import {
  GetClients,
  GetDevices,
  GetEngagements,
  GetPlatforms,
} from "../../../actions/report";
import { GetSnippets } from "../../../actions/snippet";
import {
  CustomTable,
  DateRange,
  Select,
  TextBox,
  TimeRange,
  Button,
} from "../../../components/html";
import {
  BarChart,
  ByDevice,
  CampaignMonitorList,
  LineChart,
  PercentageDisplay,
  StackedGraph,
  PieChart,
  CountDisplay,
} from "../../../components/report";
import notification from "../../../core/services/alert";
import { getQuery } from "../../../core/helpers/engagements";

import "./ViewReport.scss";
import { Loading } from "../../../components/shared";
import { GetCountries } from "../../../actions/country";
import { activities, downloadFile } from "../../../core/helpers/report";
import { AverageDisplay } from "../../../components/report/averageDisplay/AverageDisplay";
import site from "../../../sitemap";
import EngagementTable from "./EngagementTable";

const columns = [
  {
    label: "Date",
    key: "date",
    render: (val, engagement) => {
      if (engagement.journey.find((e) => e.activity == "view")) {
        const { date } = engagement.journey.find((e) => e.activity == "view");
        return moment(date).format("MM-DD-YYYY");
      }

      try {
        const { date } = engagement.journey.find((e) => e.activity == "click");
        return moment(date).format("MM-DD-YYYY");
      } catch (error) {
        return null;
      }
    },
  },
  {
    label: "Time",
    key: "time",
    render: (val, engagement) => {
      if (engagement.journey.find((e) => e.activity == "view")) {
        const { time } = engagement.journey.find((e) => e.activity == "view");
        return moment(
          Date.parse(`01 Jan 1970 ${time.replace(/.(?<=\.)[^.]*$/, "")} UTC`)
        ).format("hh:mm a");
      }

      try {
        const { time } = engagement.journey.find((e) => e.activity == "click");
        return moment(
          Date.parse(`01 Jan 1970 ${time.replace(/.(?<=\.)[^.]*$/, "")} UTC`)
        ).format("hh:mm a");
      } catch (error) {
        return null;
      }
    },
  },
  {
    label: "Receiver",
    key: "receiver",
    render: (val, engagement) => {
      try {
        const { receiver } = engagement.journey.find((e) => e.receiver != "");
         return receiver || engagement.ipAddress;
          // if(receiver=='john@domain.com'){
          //   return engagement.ipAddress
          // }else{
          //   return receiver;
          // }

      } catch (error) {
        return engagement.ipAddress;
      }
    },
  },
  {
    label: "View Time (secs)",
    key: "durationSecs",
    render: (val, engagement) => {
      if (engagement.journey.find((e) => e.activity == "view")) {
        const { durationSecs } = engagement.journey.find(
          (e) => e.activity == "view"
        );
        return durationSecs;
      }

      try {
        const { durationSecs } = engagement.journey.find(
          (e) => e.activity == "click"
        );
        return durationSecs;
      } catch (error) {
        return 0;
      }
    },
  },
  {
    label: "Online View Time (secs)",
    key: "durationSecs",
    render: (val, engagement) => {
      try {
        const { durationSecs } = engagement.journey.find(
          (e) => e.activity == "web-view"
        );
        return durationSecs;
      } catch (error) {
        return 0;
      }
    },
  },
  {
    label: "Location",
    key: "country",
    render: (val, engagement) => {
      const { city, state, country } = engagement.journey[0];
      return (
        <p>
          {city}, {state}
          <br />
          {country}
        </p>
      );
    },
  },
];

const initialFilters = {
  dateRange: {
    startDate: "",
    endDate: "",
  },
  timeRange: {
    startTime: "",
    endTime: "",
  },
  selectedDevices: [],
  selectedPlatforms: [],
  selectedClients: [],
  selectedCountries: [],
    ipAddress: "",
    receiver:""
};

const ViewReport = ({ match }) => {
  const routeSnippetId = match.params.id || null;

  const [snippet, setSnippet] = useState("");
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const [snippets, setSnippets] = useState([]);

  const [engagements, setEngagements] = useState([]);

  const [devices, setDevices] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [engagementsLoading, setEngagementsLoading] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filters

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const didMount = async () => {
      getSnippets();
      getDevices();
      getPlatforms();
      getClients();
      getCountries();
    };
    didMount();
 
  }, []);

  useEffect(() => {
    console.log("fitering",filters)
    if (snippet) getEngagements(filters);
    else setEngagements([]);
  }, [snippet]);

 useEffect(()=>{
  console.log("filter",filters,snippets,engagements)
 },[filters,snippets,engagements])


  const _onChange = (event) => {
    setSnippet(snippets.filter((s) => s.value === event.target.value)[0]);
  };

  const _removeSnippet = () => {
    setSnippet(null);
  };

  const _reloadEngagements = () => {
    getEngagements(filters);
  };

  const getDevices = async () => {
    let res = await GetDevices();
    if (res.result) {
      setDevices(
        Object.keys(res.body).map((key) => ({
          text: res.body[key],
          value: key,
        }))
      );
    }
  };

  const getPlatforms = async () => {
    let res = await GetPlatforms();
    if (res.result) {
      setPlatforms(
        Object.keys(res.body).map((key) => ({
          text: res.body[key],
          value: key,
        }))
      );
    }
  };

  const getClients = async () => {
    let res = await GetClients();
    if (res.result) {
      setClients(
        Object.keys(res.body).map((key) => ({
          text: res.body[key],
          value: key,
        }))
      );
    }
  };

  const getCountries = async () => {
    let res = await GetCountries();

    if (res.result) {
      const c = res.body.map((country) => ({
        text: country.countryName,
        value: country.countryCode,
      }));
      c.unshift({ text: "All", value: "" });
      setCountries(c);
    }
  };

  const getSnippets = async () => {
    let query = "?status=true";
    let res = await GetSnippets(query);

    if (res.result) {
      let options = res.body.map((snippet) => {
        return {
          value: snippet.snippet,
          text: snippet.title,
          thumbnailUrl: snippet.thumbnailUrl,
        };
      });
      setSnippets(options);

      if (routeSnippetId) {
        setSnippet(options.find((s) => s.value == routeSnippetId));
      }
    } else {
      notification.error(res.message, "snippetRetrievalFailed");
    }
    setSnippetsLoading(false);
  };

  const getEngagements = async (filters) => {
      //console.log('filters---Akshay', filters);
   
      const filterData = Object.assign({}, filters);
      //console.log("gasdsadasd", filterData)
    delete filterData.dateRange;

    const filterDataRange = Object.assign({}, filters.dateRange);
   if(filterDataRange.startDate !="" && filterDataRange.endDat  !="" ){
    let trimmedDateSt = filterDataRange.startDate.trim();
      let formattedDateSt = moment(trimmedDateSt, 'DD/MM/YYYY').format('YYYY-MM-DD');

      let trimmedDateEndDt = filterDataRange.endDate.trim();
      let formattedDateEndDt = moment(trimmedDateEndDt, 'DD/MM/YYYY').format('YYYY-MM-DD');

      filterDataRange.startDate=formattedDateSt;
      filterDataRange.endDate=formattedDateEndDt;
   }
  
      const combinedObject = {
        ...filterData,
        dateRange: filterDataRange 
      };
 
      
   // console.log("filterData",filterData);
    //console.log("filters", filters);
    //console.log("filters", combinedObject);
    
    setEngagementsLoading(true);
    let res = await GetEngagements(snippet.value, getQuery(combinedObject));
    // let body = [];
    // if (res.result) {
    //   // body = res.body.map((eng) => ({
    //   //   ...eng,
    //   //   activity: activities[eng.activity],
    //   // }));
    // }
    console.log("body",res.body);
    setEngagements(res.body);
    setEngagementsLoading(false);
  };

  const _onDateChange = ({ startDate, endDate }) => {
  
    let { dateRange } = filters;
    dateRange = { startDate, endDate };
    setFilters({ ...filters, dateRange });
  };

  const _onTimeChange = ({ startTime, endTime }) => {
    let { timeRange } = filters;
    timeRange = { startTime, endTime };
    setFilters({ ...filters, timeRange });
  };

  const _onSelectedDevicesChange = (event) => {
    const {
      target: { options, value },
    } = event;

    const selected = options
      .filter((s) => value.indexOf(s.value) > -1)
      .map((v) => v.value);

    setFilters({ ...filters, selectedDevices: [...selected] });
  };

  const _onSelectedPlatformsChange = (event) => {
    const {
      target: { options, value },
    } = event;

    const selected = options
      .filter((s) => value.indexOf(s.value) > -1)
      .map((v) => v.value);

    setFilters({ ...filters, selectedPlatforms: [...selected] });
  };

  const _onSelectedClientsChange = (event) => {
    const {
      target: { options, value },
    } = event;

    const selected = options
      .filter((s) => value.indexOf(s.value) > -1)
      .map((v) => v.value);

    setFilters({ ...filters, selectedClients: [...selected] });
  };

  const _onSelectedCountriesChange = (event) => {
    const {
      target: { options, value },
    } = event;

    const selected = options
      .filter((s) => value.indexOf(s.value) > -1)
      .map((v) => v.value);

    setFilters({ ...filters, selectedCountries: [...selected] });
  };

    const _applyFilter = () => {
     getEngagements(filters);
  };

  const _clearFilter = () => {
    
    setFilters(initialFilters);
    getEngagements(initialFilters);
  
  };

  const _onClickDownloadFile = () => {
    setIsLoading(true);
    downloadFile(`/api/reports/${snippet.value}/download`, "record.csv")
      .then((res) => {
        setIsLoading(false);
      })
      .catch((rej) => {
        setIsLoading(false);
        notification.error("Failed to download", "Failed");
      });
  };
const [snippetId,setSnippetId] = useState(null);

    useEffect(() => {
        console.log("snippet?.value", snippet)
  if(snippet?.value !=""){
    setSnippetId(snippet?.value);
  }
},[snippet])


/*

 const filterData = Object.assign({}, filters);
   
       
      let trimmedDateSt = filterData.dateRange.startDate.trim();
      let formattedDateSt = moment(trimmedDateSt, 'DD/MM/YYYY').format('YYYY-MM-DD');

      let trimmedDateEndDt = filterData.dateRange.endDate.trim();
      let formattedDateEndDt = moment(trimmedDateEndDt, 'DD/MM/YYYY').format('YYYY-MM-DD');

      filterData.dateRange.startDate=formattedDateSt;
      filterData.dateRange.endDate=formattedDateEndDt;
  console.log("filter data",filterData);



*/

  return (
    <div id="view-report-page">
      <div>
        <div className="row">
          <div className="column">
            {snippet ? (
              <div>
                <header className="flex flex-col md:flex-row items-center justify-between gap-y-5 gap-x-3">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={snippet.thumbnailUrl}
                      style={{ width: "128px", verticalAlign: "bottom" }}
                      className="rounded"
                    />

                    <h1 className="text-2xl font-bold mt-0">{snippet.text}</h1>
                  </div>

                  <Button
                    className="button-secondary"
                    title="Change EyeMail"
                    iconType={"solid"}
                    onClick={_removeSnippet}
                    text="Change EyeMail"
                  />
                </header>

                <div>
                  {!engagementsLoading && (
                    <div className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5 mt-6">
                      <Button
                        iconType={"solid"}
                        className="button-secondary"
                        icon={"file-download"}
                        title={"Export"}
                        onClick={_onClickDownloadFile}
                        loading={isLoading}
                      />

                      <Menu compact>
                        <Dropdown
                          icon="rss"
                          text="Feed "
                          options={[
                            { key: 1, text: "JSON", value: "json" },
                            { key: 2, text: "XML", value: "xml" },
                          ]}
                          simple
                          item
                          onChange={(e, data) => {
                           /* window.open(
                              `${site.routes.reportsFeed.route}/${snippetId}/${data.value}`,
                              "_blank"
                            ); */
                            window.open(
                              `${site.routes.feedDatas.route}/${snippetId}/${data.value}`,
                              "_blank"
                            );
                          }}
                        />
                      </Menu>

                      <button
                        type="button"
                        onClick={_reloadEngagements}
                        className="flex items-center text-light-rose-dark font-bold py-2 hover:underline hover:text-light-rose-dark"
                      >
                        <svg
                          className="fill-current text-light-rose-dark h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z" />
                        </svg>
                        <span>Refresh data</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !(routeSnippetId && snippetsLoading) && (
                <div className="filter snippet-filter">
                  <header>
                    <h1 className="text-2xl font-bold pb-3">EyeMail</h1>
                  </header>

                  <Select
                    options={snippets}
                    value={snippet ? snippet.value : ""}
                    fluid={true}
                    selection={true}
                    multiple={false}
                    required={true}
                    loading={snippetsLoading}
                    id="snippet"
                    name="snippet"
                    validator={(value) => value != ""}
                    placeholder="Select from your EyeMails"
                    onChange={_onChange}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="row mt-5">
          <div className="column">
            <Accordion fluid styled>
              <Accordion.Title
                active={isFilterExpanded}
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <Icon name="filter" />
                Filter
              </Accordion.Title>
              <Accordion.Content active={isFilterExpanded}>
                <div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 w-full">
                    <div>
                      <DateRange
                        label="Date Range"
                        startDate={filters.dateRange.startDate}
                        endDate={filters.dateRange.endDate}
                        onChange={_onDateChange}
                      />
                    </div>
                    {/* <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                      <Select
                        options={devices}
                        value={filters.selectedDevices}
                        fluid={true}
                        selection={true}
                        multiple={true}
                        id='selectedDevices'
                        name='selectedDevices'
                        placeholder='Select Devices'
                        onChange={_onSelectedDevicesChange}
                      />
                    </div> */}
                    {/* <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                      <TimeRange
                        startTime={filters.timeRange.startTime}
                        endTime={filters.timeRange.endTime}
                        onChange={_onTimeChange}
                      />
                    </div> */}
                    {/* <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                      <Select
                        options={platforms}
                        value={filters.selectedPlatforms}
                        fluid={true}
                        selection={true}
                        multiple={true}
                        required={true}
                        id='selectedPlatforms'
                        name='selectedPlatforms'
                        placeholder='Select Platforms'
                        onChange={_onSelectedPlatformsChange}
                      />
                    </div> */}
                    {/* <div className='eight wide computer eight wide tablet sixteen wide mobile column'>
                      <Select
                        options={clients}
                        value={filters.selectedClients}
                        fluid={true}
                        selection={true}
                        multiple={true}
                        id='selectedClients'
                        name='selectedClients'
                        placeholder='Select Clients'
                        onChange={_onSelectedClientsChange}
                      />
                    </div> */}
                    <div>
                      <Select
                        label="Country"
                        options={countries}
                        value={filters.selectedCountries}
                        fluid={true}
                        selection={true}
                        multiple={true}
                         search={true}
                        id="selectedCountries"
                        name="selectedCountries"
                        placeholder="All"
                        onChange={_onSelectedCountriesChange}
                      />
                    </div>
                    <div>
                      <TextBox
                        label="Receiver"
                        value={filters.receiver}
                        fluid={true}
                        id="receiver"
                        name="receiver"
                        placeholder="Email"
                        customstyle={true}
                        onChange={(event) =>
                          setFilters({
                            ...filters,
                              receiver: event.target.value,
                          })
                        }
                        
                        
                      />
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="sixteen wide column">
                      <Button
                        inline={true}
                        category={"brand"}
                        size={"large"}
                        title="Apply Filter"
                        className="filter-btn"
                        onClick={_applyFilter}
                        disabled={!snippet}
                        loading={engagementsLoading}
                      />
                      <Button
                        inline={true}
                        size={"large"}
                        title="Clear"
                        className="filter-btn"
                        onClick={_clearFilter}
                      />
                    </div>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
        {snippet &&
          (engagementsLoading ? (
            <div className="ui center aligned grid">
              <Loading />
            </div>
          ) : engagements && engagements.length ? (
            <>
              <div className="w-full mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div>
                  <CountDisplay
                    engagements={engagements}
                    snippet={snippet}
                    name={"Total Views"}
                    type={"view"}
                  />
                </div>
                <div>
                  <CountDisplay
                    engagements={engagements}
                    snippet={snippet}
                    name={"Total Clicks"}
                    type={"click"}
                  />
                </div>
                <div>
                  <AverageDisplay
                    activity={"view"}
                    engagements={engagements}
                    snippet={snippet}
                    name={"Average View Time"}
                    helpText={"secs"}
                  />
                </div>


                {/* <div className="four wide computer eight wide tablet sixteen wide mobile column">
                  <CountDisplay
                    engagements={engagements}
                    snippet={snippet}
                    name={"Unique Clicks"}
                    type={"uniqueClick"}
                  />
                </div> */}
                {/* <div className='three wide computer eight wide tablet sixteen wide mobile column'>
                  <PercentageDisplay
                    engagements={engagements}
                    snippet={snippet}
                    name={'view'}
                  />
                </div>
                <div className='three wide computer eight wide tablet sixteen wide mobile column'>
                  <PercentageDisplay
                    engagements={engagements}
                    snippet={snippet}
                    name={'click'}
                  />
                </div> */}
              </div>
              {/* <div className='row'>
                <div className='sixteen wide computer sixteen wide tablet sixteen wide mobile column'>
                  <LineChart engagements={engagements} snippet={snippet} />
                </div>
              </div> */}
              <div className="w-full xl:grid xl:grid-cols-3 gap-x-5 mt-5">
                <div className="xl:col-span-2 bg-light-rose rounded border border-gray-200">
                  <LineChart engagements={engagements} snippet={snippet} />
                  {/* <CampaignMonitorList
                    engagements={engagements}
                    snippet={snippet}
                  /> */}
                </div>
                <div className="bg-light-rose rounded border border-gray-200 mt-5 xl:mt-0">
                  <PieChart engagements={engagements} snippet={snippet} />
                </div>
              </div>

              <div className="bg-light-rose rounded border border-gray-200 py-6 px-8 mt-5">
                <div className="column">
                  <h2 className="text-base text-light-rose-dark">
                    Per Viewer Analysis
                  </h2>
                  {/* <CustomTable columns={columns} data={engagements} /> */}
                  <EngagementTable engagements={engagements} />
                </div>
              </div>
            </>
          ) : (
            <div className="py-6">
              <p className="text-light-rose-dark">
                There are no engagements found for this EyeMail.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export { ViewReport };
