// @ts-nocheck
import React, { Component } from "react";
// eslint-disable-next-line no-restricted-imports
import moment from "moment";
import { HeatMapGrid } from "react-grid-heatmap";
import HeatColorRanges from "./HeatColorRanges/HearColorRanges";
import "./HeatMapGridComponent.scss";
import { findLastIndex } from "lodash";

export const HIGHLIGHTS_DATE_ENUM = {
     ONE_DAY: "ONE_DAY",
     ONE_WEEK: "SEVEN_DAYS",
     ONE_MONTH: "THIRTY_DAYS",
};

const TIME_RANGE_CSS: any = {
     THIRTY_DAYS: {
          fontSize: "24px",
          width: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "2px",
          marginRight: "4px",
          border: "none",
          backgroundColor: "transparent",
     },
     SEVEN_DAYS: {
          fontSize: "11px",
          width: "32px",
          height: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "3px",
          marginRight: "48px",
          color: "#fff",
     },
     ONE_DAY: {
          fontSize: "11px",
          width: "21px",
          height: "21px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "2px",
     },
};

class HeatMapGridComponent extends Component {
     constructor(props: any) {
          super(props);
          this.state = {
               newData: [],
               yLabels: [],
               xLabels: [],
               xLabelsVisibility: [],
          };
     }

     componentDidMount() {
          this.manupulateData();
     }

     manupulateData = () => {
          const { data, timeRange }: any = this.props;
          let xLabels: string[] = [];
          const yLabels: any[] = [];
          const newData: unknown[][] = [];
          let doubleArr = [];
          let xLabelsVisibilityShow: boolean[] = [];
          if (data[0].errorCounts) {
               Object.entries(data[0].errorCounts).map((_, index) => {
                    if (timeRange === HIGHLIGHTS_DATE_ENUM.ONE_MONTH) {
                         xLabelsVisibilityShow.push(index % 3 === 0);
                    } else if (timeRange === HIGHLIGHTS_DATE_ENUM.ONE_DAY) {
                         xLabelsVisibilityShow.push(index % 2 === 0);
                    }
               });
               data.forEach(
                    (
                         item: {
                              name: any;
                              errorCounts:
                                   | { [s: string]: unknown }
                                   | ArrayLike<unknown>;
                         },
                         index: number
                    ) => {
                         doubleArr = [];
                         yLabels.push(item.name);
                         for (const [key, value] of Object.entries(
                              item.errorCounts
                         ).sort()) {
                              if (index === 0) {
                                   xLabels.push(
                                        moment(key, "YYYY-MM-DD HH:mm:ss.sss Z")
                                             .local()
                                             .format(
                                                  timeRange !==
                                                       HIGHLIGHTS_DATE_ENUM.ONE_DAY
                                                       ? "DD/MM"
                                                       : "hh:mm A"
                                             )
                                   );
                              }
                              doubleArr.push(value);
                         }
                         newData.push(doubleArr);
                    }
               );
          }
          this.setState({
               yLabels: yLabels,
               xLabels: xLabels,
               newData: newData,
               xLabelsVisibility: xLabelsVisibilityShow,
          });
     };

     handleTimeRangeCss = (timeRange: any) => {
          switch (timeRange) {
               case HIGHLIGHTS_DATE_ENUM.ONE_DAY:
                    return "heatmap-grid-container-one-day";
               case HIGHLIGHTS_DATE_ENUM.ONE_WEEK:
                    return "heatmap-grid-seven-container";
               case HIGHLIGHTS_DATE_ENUM.ONE_MONTH:
                    return "heatmap-grid-container";
               default:
          }
     };

     render() {
          const { yLabels, xLabels, newData }: any = this.state;
          const { timeRange, data, handlerId }: any = this.props;

          const tempData = data.map(
               (el: {
                    repo: { fullName: string };
                    name: string;
                    totalErrorCount: any;
                    id: any;
               }) => {
                    let newWorkflowName = el?.repo?.fullName + "/" + el?.name;
                    return {
                         repoWorkflowName: newWorkflowName,
                         total: el.totalErrorCount,
                         pathData: {
                              workflowId: el.id,
                              workflowName: newWorkflowName,
                              repoFullName: el?.repo?.fullName,
                         },
                    };
               }
          );

          const rowJSX = tempData.map(
               (
                    el: {
                         pathData: any;
                         repoWorkflowName:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                     any,
                                     string | React.JSXElementConstructor<any>
                                >
                              | React.ReactFragment
                              | React.ReactPortal
                              | null
                              | undefined;
                         total:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                     any,
                                     string | React.JSXElementConstructor<any>
                                >
                              | React.ReactFragment
                              | React.ReactPortal
                              | null
                              | undefined;
                    },
                    index: React.Key | null | undefined
               ) => {
                    return (
                         <tr
                              className="avg-duration-list-widget-row"
                              key={index}
                              onClick={(event) => handlerId(event, el.pathData)}
                              style={{ height: "24px" }}
                         >
                              <td>
                                   <div
                                        style={{ textAlign: "center" }}
                                        className="workflow-id"
                                   >
                                        {index + 1}
                                   </div>
                              </td>
                              <td>
                                   <div className="workflow-name">
                                        <span className="workflow-list-cell-text">
                                             {el.repoWorkflowName}
                                        </span>
                                   </div>
                              </td>
                              <td>
                                   <div
                                        className="workflow-stat"
                                        style={{ textAlign: "right" }}
                                   >
                                        <span className="workflow-list-cell-text">
                                             {el.total}
                                        </span>
                                   </div>
                              </td>
                         </tr>
                    );
               }
          );

          return (
               <>
                    <div className={this.handleTimeRangeCss(timeRange)}>
                         <HeatColorRanges data={newData} range={timeRange} />
                         <HeatMapGrid
                              xLabels={xLabels}
                              yLabels={yLabels.map(
                                   (value: any, index: any) => index + 1
                              )}
                              xLabelsStyle={(index: number) => ({
                                   fontSize: 8,
                                   width: 30,
                                   flexBasis: "unset",
                                   marginLeft: "-6px",
                              })}
                              xLabelsPos={"bottom"}
                              yLabelsStyle={(index: number) => ({
                                   width: 10,
                              })}
                              data={newData || []}
                              cellHeight={"20px"}
                              square
                              onClick={(x, y) => console.log(x, y)}
                              cellStyle={(x, y, ratio) => ({
                                   ...TIME_RANGE_CSS[timeRange],
                              })}
                              cellRender={(x, y, value) => (
                                   <div
                                        style={{
                                             fontSize: 10,
                                             color: "#fff",
                                             background: Object.is(0, value)
                                                  ? "rgb(37 42 47)"
                                                  : `rgb(239, 38, 34, ${
                                                         value * 0.05
                                                    }`,
                                             width: 50,
                                             height: 50,
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center",
                                        }}
                                        title={`${moment(
                                             xLabels[y],
                                             "DD/MM"
                                        ).format("DD MMM")} - ${value} errors`}
                                   >
                                        {value}
                                   </div>
                              )}
                         />
                    </div>
                    <div
                         className={
                              timeRange === HIGHLIGHTS_DATE_ENUM.ONE_WEEK
                                   ? "label-que"
                                   : "label-que-small"
                         }
                    >
                         <div className="avg-header-container">
                              <table
                                   className="avg-duration-list-table"
                                   cellSpacing="0"
                                   cellPadding="0"
                              >
                                   <tbody>
                                        <tr>
                                             <th
                                                  style={{
                                                       width: 80,
                                                       textAlign: "center",
                                                  }}
                                                  className="header-workflow-id"
                                             >
                                                  No
                                             </th>
                                             <th
                                                  style={{ textAlign: "left" }}
                                                  className="header-workflow-name"
                                             >
                                                  Workflow name
                                             </th>
                                             <th
                                                  style={{
                                                       width: 150,
                                                       textAlign: "right",
                                                  }}
                                                  className="header-workflow-duration"
                                             >
                                                  # of errors
                                             </th>
                                        </tr>
                                        {rowJSX}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </>
          );
     }
}
export default HeatMapGridComponent;
