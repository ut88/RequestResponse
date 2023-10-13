// eslint-disable-next-line
// react libs
import React from "react";

// shared common libs
import DrillTable from "@shared/visuals/DrillTable";

// public interface
import TemplateComponent from "../TemplateComponent";
import QueryDataMapper from "@query/QueryDataMapper";
//Utils
import visualStateDataMapper from "./util/visualStateDataMapper";
import constants from "./constants/constants";

export default class OverlapTable extends TemplateComponent {
    /**
     * {@inheritDoc}
     * @see TemplateComponent.initState
     */
    initState(props) {
        // return the component's default state
        return {
            queryData: null,
            visualLastMapped: null,
            visualData: null,
            visualDataHeaders: [],
            isRefreshing: true,
            options: {
                cssClassNames: {
                    headerCell:
                        "padding fontUpdate border-cell background-neutural-white google-visualization-table-type-number",
                    selectedTableRow: "highlight tr-expanded",
                    hoverTableRow: "background-accent-background hoverCell ",
                    oddTableRow: "alternate-row"
   
                }
            }
        };
    }

    /**
     * Initialize template lifecycle listeners
     * @see TemplateComponent.initListeners
     */
    initListeners() {
        this.addBeforeQueryListener(
            this.props.queryName,
            ({ changedParamNames, hasChangedParams, hasFilterData }) => {
                this.setState((state, props) => {
                    return {
                        isRefreshing:
                            state.isRefreshing ||
                            hasChangedParams ||
                            hasFilterData
                    };
                });
            }
        );
        this.addQueryListener(this.props.queryName, queryData => {
            this.refreshVisualState(queryData);
        });
    }
    /**
     * Refresh the visual state with new query data
     * @param {QueryData} queryData
     * @returns {void}
     */

    formattedDate(inputDateTime) {
        inputDateTime = inputDateTime * 1000;
        const date = new Date(inputDateTime);

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };
        const formattedDate = date
            .toLocaleString("en-US", options)
            .replace("at", "@");
        return formattedDate;
    }

    refreshVisualState(queryData) {
        const dataMapper = new QueryDataMapper(queryData),
            fieldNames = [
                "customer_name",
                "journey_name",
                "node_name",
                "transaction_timestamp",
                "request",
                "response",
            ];
        var condition = false;
        visualStateDataMapper.map(item => {
            dataMapper.header(item.label, item.dataType);
        });

        const structuredData = dataMapper.mapQueryData(row => {
            var data = [],totalString = "";

            fieldNames.forEach(item => {
              
                switch(item) {
                    case "customer_name":
                      totalString=`<p class="fontUpdate">Customer Name: <span>${row[queryData.getFieldByName(item).index]}</span></p>`
                      break;
                    case "journey_name":
                      totalString=totalString+`<p class="fontUpdate">Journey Name: <span>${row[queryData.getFieldByName(item).index]}</span></p>`
                      break;
                    case "node_name":
                      totalString=totalString+`<p class="fontUpdate">Node Name: <span>${row[queryData.getFieldByName(item).index]}</span></p>\n`
                      break;
                    case "transaction_timestamp":
                        const date = this.formattedDate(
                            row[queryData.getFieldByName(item).index]
                        );
                        const dateFormat = date;
                        totalString = totalString+`<p class="fontUpdate">Time Range: <span>${dateFormat}</span></p>`;
                        data.push({ v: totalString });
                        totalString="";
                       break;
                    case "request":
                        totalString=totalString+`<p class="dropdown-arrow-black">Request: </p>`+row[queryData.getFieldByName(item).index]
                            break;  
                    case "response":
                        totalString=totalString+`<p class="fontUpdate">Response: </p>`+row[queryData.getFieldByName(item).index]
                        data.push({ v: totalString });
                            break;               
                  }
            });
            return data;
        });
        structuredData.unshift(dataMapper.getStructuredHeaders());
        this.setState({
            queryData: queryData,
            visualData: structuredData,
            visualLastMapped: Date.now(),
            isRefreshing: false
        });
    }

    /**
     * Render
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div className="drill-table">
                <DrillTable
                    visualLastMapped={this.state.visualLastMapped}
                    visualData={this.state.visualData}
                    {...this.props}
                    options={this.state.options}
                />
                {this.state.isRefreshing && <div className="spinner" />}
            </div>
        );
    }
}
