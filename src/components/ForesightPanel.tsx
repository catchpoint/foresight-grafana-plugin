// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import {
     applyFieldOverrides,
     createTheme,
     FieldType,
     PanelProps,
     toDataFrame,
     ThresholdsMode,
} from "@grafana/data";
import { ForesightPanelConfig } from "../types";
import { Tab, Table, TabsBar, useTheme2 } from "@grafana/ui";

import * as ForesightApi from "@runforesight/foresight-javascript-client";

import "./common.scss";
import HeatMapGridComponent, {
     HIGHLIGHTS_DATE_ENUM,
} from "./HeatMapGridComponent/HeatMapGridComponent";

function calculatePercentage(part, total) {
     return (part / total) * 100;
}

const defaultThresholds: ThresholdsConfig = {
     steps: [
          {
               color: "gray",
               value: 0,
          },
          {
               color: "red",
               value: 30,
          },
     ],
     mode: ThresholdsMode.Absolute,
};

function convertMsToHrMinSec(ms) {
     let hours = Math.floor(ms / 3600000);
     let minutes = Math.floor((ms % 3600000) / 60000);
     let seconds = Math.floor((ms % 60000) / 1000);
     if (hours > 0) {
          return hours + " h, " + minutes + " m, and " + seconds + " s";
     } else if (minutes > 0) {
          return minutes + "m " + seconds + " s";
     } else {
          return seconds + " s";
     }
}

const TABS = [
     {
          label: "Stats of the Workflows ",
          active: true,
     },
     {
          label: "Workflow failure heatmap",
          active: false,
     },
];

let workflowsApi: ForesightApi.WorkflowsApi | null = null;
let workflowsStatsApi: ForesightApi.WorkflowsApi | null = null;

export const ForesightPanel: React.FC<PanelProps<ForesightPanelConfig>> = ({
     options,
     data,
     width,
     height,
     renderCounter,
}) => {
     const [tabs, setTabs] = useState(TABS);
     const [errorData, setErrorData] = useState([]);
     const [statsData, setStatsData] = useState([]);

     workflowsApi = new ForesightApi.WorkflowsApi(
          new ForesightApi.Configuration({
               apiKey: `ApiKey ${options.apiKey}`,
               basePath: options.basePath,
          })
     );

     workflowsStatsApi = new ForesightApi.WorkflowsApi(
          new ForesightApi.Configuration({
               apiKey: `ApiKey ${options.apiKey}`,
               basePath: options.basePath,
          })
     );

     useEffect(() => {
          getProjectForTest();
     }, []);

     /*
    An example usage of foresight api
  **/
     useEffect(() => {
          workflowsApi = new ForesightApi.WorkflowsApi(
               new ForesightApi.Configuration({
                    apiKey: `ApiKey ${options.apiKey}`,
                    basePath: options.basePath,
               })
          );

          workflowsStatsApi = new ForesightApi.WorkflowsApi(
               new ForesightApi.Configuration({
                    apiKey: `ApiKey ${options.apiKey}`,
                    basePath: options.basePath,
               })
          );
          getProjectForTest();
     }, [options.apiKey, options.basePath, renderCounter]);

     const getProjectForTest = async () => {
          if (workflowsApi !== null) {
               const erroneous =
                    await workflowsApi.getErroneousWorkflowUsingPOST({
                         timeRange: "THIRTY_DAYS",
                    });
               const stats = await workflowsStatsApi.getWorkflowsUsingPOST({});

               setStatsData(stats.data);
               setErrorData(erroneous.data);
          }
     };

     const calculateTableWorkflowStats = (theme, config) => {
          const name = statsData.map((item) => item.name);
          const failAvgDuration = statsData.map((item) =>
               convertMsToHrMinSec(item.failAverageDuration)
          );
          const executionCount = statsData.map((item) => item.executionCount);
          const successAverageDuration = statsData.map((item) =>
               convertMsToHrMinSec(item.successAverageDuration)
          );

          const successP95Duration = statsData.map((item) =>
               convertMsToHrMinSec(item.successP95Duration)
          );
          const failP95 = statsData.map((item) =>
               convertMsToHrMinSec(item.successP95Duration)
          );
          const failCount = statsData.map((item) => item.failCount);
          const successCount = statsData.map((item) => item.successCount);
          const calculateSuccessRateData = statsData.map((item) =>
               calculatePercentage(item.successCount, item.executionCount)
          );
          const calculateFailRateData = statsData.map((item) =>
               calculatePercentage(item.failCount, item.executionCount)
          );

          const dataFrame = toDataFrame({
               name: "dataFrame",
               fields: [
                    {
                         name: "Name",
                         type: FieldType.string,
                         values: name,
                    },
                    {
                         name: "Total Execution Count",
                         type: FieldType.number,
                         values: executionCount,
                    },
                    {
                         name: "Fail Rate",
                         type: FieldType.number,
                         values: calculateFailRateData,
                         config: {
                              unit: "percent",
                              min: 0,
                              max: 100,
                              displayName: "Fail Rate",
                              custom: {
                                   width: 200,
                                   displayMode: "gradient-gauge",
                              },
                              thresholds: defaultThresholds,
                         },
                    },
                    {
                         name: "Fail Count",
                         type: FieldType.number,
                         values: failCount,
                    },
                    {
                         name: "Fail P95",
                         type: FieldType.number,
                         values: failP95,
                    },
                    {
                         name: "Fail Avg. Duration",
                         type: FieldType.number,
                         values: failAvgDuration,
                    },

                    {
                         name: "Success Count",
                         type: FieldType.number,
                         values: successCount,
                    },
                    {
                         name: "Success P95 Duration",
                         type: FieldType.number,
                         values: successP95Duration,
                    },

                    {
                         name: "Success Avg. Duration",
                         type: FieldType.number,
                         values: successAverageDuration,
                    },
               ],
          });

          const dataFrames = applyFieldOverrides({
               data: [dataFrame],
               fieldConfig: {
                    defaults: {},
                    overrides: [],
               },
               replaceVariables: (value, vars, format) => {
                    return vars && value === "${__value.text}"
                         ? vars["__value"].value.text
                         : value;
               },
               timeZone: "utc",
               theme: theme,
          });
          return dataFrames[0];
     };

     const getTabHeader = () => {
          return (
               <div style={{ marginTop: 10 }}>
                    <TabsBar>
                         {tabs.map((tab, index) => {
                              return (
                                   <Tab
                                        key={tab.label}
                                        label={tab.label}
                                        active={tab.active}
                                        onChangeTab={() =>
                                             setTabs(
                                                  tabs.map((tab, idx) => ({
                                                       ...tab,
                                                       active: idx === index,
                                                  }))
                                             )
                                        }
                                   />
                              );
                         })}
                    </TabsBar>
               </div>
          );
     };

     const theme = useTheme2();
     const workflowStatsData = calculateTableWorkflowStats(theme, {});
     return (
          <div
               className={"foresight-panel-container"}
               style={{ width: `$1200px`, height: `900px` }}
          >
               {getTabHeader()}
               <div
                    className="panel-container"
                    style={{ width: "auto", height: "auto" }}
               >
                    {tabs[0].active && (
                         <Table
                              data={workflowStatsData}
                              width={1000}
                              height={900}
                         />
                    )}
                    {tabs[1].active && (
                         <HeatMapGridComponent
                              data={errorData || []}
                              timeRange={HIGHLIGHTS_DATE_ENUM.ONE_MONTH}
                         />
                    )}
               </div>
          </div>
     );
};
