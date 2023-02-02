/* eslint-disable */
import React, { Component } from "react";
import "./HeatColorRanges.scss";

export const HIGHLIGHTS_DATE_ENUM = {
     ONE_DAY: "ONE_DAY",
     ONE_WEEK: "SEVEN_DAYS",
     ONE_MONTH: "THIRTY_DAYS",
};

class HeatColorRanges extends Component {
     render() {
          const { range, data } = this.props as any;

          let min = 0;
          let max = 0;
          data.forEach((yRows: any[]) => {
               yRows.forEach((val: number) => {
                    if (val > max) max = val;
                    if (val < min) min = val;
               });
          });

          const rangeCount = 20;
          const ratioRange = 100 / rangeCount;
          const total = max - min;
          const gap = total / rangeCount;

          let bgCssVal = "linear-gradient(to right, #151A20 0%,";
          for (let i = 1; i < rangeCount; i++) {
               const value = min + i * gap;
               const color = `rgb(203, 10, 47, ${
                    1 - (max - value) / (max - min) + 0.1
               })`;
               bgCssVal =
                    bgCssVal +
                    " " +
                    color +
                    " " +
                    i * ratioRange +
                    "% " +
                    (i + 1) * ratioRange +
                    "%";
               if (i < rangeCount - 1) bgCssVal += ",";
               else bgCssVal += ")";
          }

          return (
               <div className="heatmap-color-ranges">
                    <div
                         className={
                              range !== HIGHLIGHTS_DATE_ENUM.ONE_MONTH
                                   ? "heatmap-color-ranges-colors-width"
                                   : "heatmap-color-ranges-colors"
                         }
                         style={{ background: bgCssVal }}
                    >
                         <span className="heatmap-color-ranges-start-val">
                              Less Errors
                         </span>
                         <span className="heatmap-color-ranges-end-val">
                              More Errors
                         </span>
                    </div>
               </div>
          );
     }
}

export default HeatColorRanges;
