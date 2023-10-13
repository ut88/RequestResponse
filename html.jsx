// eslint-disable-next-line
// react is needed for JSX
import React from "react";
import ReactDatePicker from "react-datepicker";

// common libraries
import MultiSelectSearchableComboBox from "@lib/components/MultiSelectSearchableComboBox";
import TransactionRequestResponseDetail from "./TransactionRequestResponseDetail";
import TransactionRequestResponseCommon from "./util/TransactionRequestResponseDetailsDataMapper";

// system libraries
import ExportQueryDataSelect from "@lib/components/ExportQueryDataSelect";

// the TemplateComponent is the base component class
import TemplateComponent from "../TemplateComponent";

//constants
import constants from "./constants/constants";
import commonConstants from "../shared/constants/constants";

// import the template styles
import "./styles.scss";
import "react-datepicker/dist/react-datepicker.css";
/**
 * The Template HTML file is the template's entry point
 * @class
 */
export default class Html extends TemplateComponent {
    initState(props) {
        const todayDate = this.format(new Date());
        const currentDate = new Date(todayDate);
        currentDate.setDate(currentDate.getDate() - 30);
        const lastMonth = this.format(currentDate);
        const currentDate2 = new Date(todayDate);
        const monthsBack = currentDate2.setMonth(currentDate2.getMonth() - 18);
        return {
            loading: true,
            reportIndex: 0,
            isRefreshing: false,
            startdateList: [],
            startdate: "",
            enddateList: [],
            enddate: "",
            ruleList: [],
            rule: [],
            nodeList: [],
            node: "",
            nodeQuery: [],
            nodeSelected: [
                { name: "All", value: "All", checked: true, index: 0 }
            ],
            nodeLabel: "All",
            journeyList: [],
            journey: "",
            journeyQuery: [],
            journeySelected: [
                { name: "All", value: "All", checked: true, index: 0 }
            ],
            journeyLabel: "All",
            customerList: [],
            customer: "",
            customerQuery: [],
            customerSelected: [
                { name: "All", value: "All", checked: true, index: 0 }
            ],
            customerLabel: "All",
            startDate: new Date(lastMonth),
            endDate: new Date(todayDate),
            monthsBack: new Date(monthsBack)
        };
    }
    format(dateInput) {
        const date = dateInput
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "")
            .slice(0, 19);
        return date;
    }

    addListerner(filterKey, valueKey, queryName) {
        this.addQueryListener(filterKey, queryData => {
            this.setDropdownList(
                queryData.records,
                valueKey,
                queryName,
                filterKey
            );
        });
    }

    initListeners() {
        // initialize exportable queries
        this.initExportQueries("txn-api-request-response");
        this.addListerner("txn-node-name-filter", "nodeList", "node");
        this.addListerner("txn-journey-name-filter", "journeyList", "journey");
        this.addListerner(
            "txn-customer-name-filter",
            "customerList",
            "customer"
        );
    }

    setDropdownList(listData, listKey, valueKey, queryName) {
        let list = [];
        this.useQuery(queryName, false);
        if (
            listKey === "nodeList" ||
            listKey === "journeyList" ||
            listKey === "customerList" ||
            listKey === "ruleList"
        ) {
            list.push({ name: "All", value: "All" });
        }
        listData.forEach(data => {
            if (data[0] == null) {
                list.push({ name: "NULL", value: "NULL" });
            } else {
                list.push({ name: data[0], value: data[0] });
            }
        });
        if (list.length > 0 && list[0].value) {
            if (listKey == "enddateList") {
                this.setState({
                    [listKey]: list,
                    [valueKey]: list[list.length - 1].value
                });
            } else {
                this.setState({ [listKey]: list, [valueKey]: list[0].value });
            }
        }
    }

    configDidLoad(config) {
        try {
            const dropDownEvtDim = config.parameters["dropdown.evtdim"];
            if (typeof dropDownEvtDim === "string") {
                const options = JSON.parse(dropDownEvtDim.replace(/'/g, '"'));
                if (Array.isArray(options) && options.length !== 0) {
                    this.parameters.evtdim = options[0][0];
                }
            }
        } catch (err) {
            console.error(err.stack);
        }

        this.useQuery("txn-api-request-response");
        this.useQuery("txn-customer-name-filter");
        this.useQuery("txn-journey-name-filter");
        this.useQuery("txn-node-name-filter");

        // update the visual
        this.setState({ loading: false });
    }

    refreshQueryData() {
        this.setState({
            isRefreshing: this.parameters.hasDirtyParams()
        });

        return super.refreshQueryData().then(() => {
            this.setState({ isRefreshing: false });
        });
    }

    renderTransactionsTimelineDetailsReport() {
        if (this.state.loading) {
            return;
        }
        return (
            <TransactionRequestResponseDetail
                {...this.props}
                queryName="txn-api-request-response"
            />
        );
    }

    /**
     * Get a data mapper function for a mapped export option name
     * @param {string} optionKey
     * @param {string} queryName
     * @param {QueryData} queryData
     * @param {QueryDataMapper} dataMapper
     * @returns {function}
     */
    getQueryDataMapperFn(optionKey, queryName, queryData, dataMapper) {
        const transactionRequestResponseCommon = new TransactionRequestResponseCommon(
            this.parameters,
            this.state,
            this.templateService,
            true
        );
        switch (optionKey) {
            case "export-f&r":
                return transactionRequestResponseCommon.TransactionRequestResponseDataMapper(
                    queryName,
                    queryData,
                    dataMapper
                );
        }
    }

    // /**
    //  * Generate a select box with exportable query options
    //  * @returns {JSX.Element}
    //  */
    exportQueryDataSelect() {
        const optionSelectMap = {
            "export-f&r": {
                name: "Transaction Request/Response Details",
                fileName: "Transaction Request/Response Details.csv",
                queryName: "txn-api-request-response"
            }
        };
        return (
            <div id="padding">
                <ExportQueryDataSelect
                    templateComponent={this}
                    optionSelectMap={optionSelectMap}
                    queryDataMapperFn={this.getQueryDataMapperFn}
                />
            </div>
        );
    }

    formattedDate(inputDateTime) {
        const date = new Date(inputDateTime);
        // Format the date as "YYYY-MM-DD HH:mm:ss"
        const formatDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
        return formatDate;
    }

    onChangeDateSelect(inputDateTime, label, type) {
        const date = this.formattedDate(inputDateTime);
        if (this.state.isRefreshing) {
            return;
        }
        const previous = this.formattedDate(this.state.startDate);
        const selected = date;
        if (previous !== selected) {
            this.parameters.setParameter(label, `'${selected}'`);
            this.refreshQueryData().then(() => {
                this.setState({ [type]: selected });
            });
        } else {
            this.setState({
                [type]: selected
            });
        }
    }

    onOptionChange(option, label, stateName, paramName, queryName) {
        let allSlected = false;
        let otherSelected = false;

        for (let i = 0; i < option.length; i++) {
            if (option[i].checked) {
                if (option[i].value === "All") allSlected = true;
                else otherSelected = true;
            }
        }
        if (allSlected && otherSelected) {
            alert("All option cannot be selected with other options");
            return;
        } else {
            if (this.state.isRefreshing) {
                return;
            }
            if (option.length <= 1) {
                this.setState({
                    [label]: option[0].value
                });
            } else {
                this.setState({
                    [label]: "Multiple Options Selected"
                });
            }
            const values = option.map(entry => `'${entry.value}'`);
            if (option.length > 0) {
                this.setState({
                    [stateName]: option
                });
            }
            this.parameters.setParameter(paramName, `${values}`);

            this.refreshQueryData().then(() => {
                this.setState({ [queryName]: values });
            });
        }
    }

    renderDatePicker(label, type, dateValue) {
        return (
            <div>
                <ReactDatePicker
                    wrapperClassName="wrapper"
                    className="input date-picker-input"
                    selected={new Date(dateValue)}
                    onChange={date =>
                        this.onChangeDateSelect(date, label, type)
                    }
                    dateFormat={constants.DATE_FORMAT}
                    timeFormat={constants.TIME_FORMAT}
                    timeIntervals={1}
                    showTimeSelect
                    minDate={new Date(this.state.monthsBack)}
                    maxDate={this.state.endDate}
                />
            </div>
        );
    }

    /**
     * Generate a select box with selectable mode
     * @returns {JSX.Element}
     */

    startDateSelect() {
        return (
            <div>
                <ReactDatePicker
                    wrapperClassName="wrapper"
                    className="input date-picker-input"
                    selected={new Date(this.state.startDate)}
                    onChange={date =>
                        this.onChangeDateSelect(
                            date,
                            "transaction_start_datetime",
                            "startDate"
                        )
                    }
                    dateFormat={constants.DATE_FORMAT}
                    timeFormat={constants.TIME_FORMAT}
                    timeIntervals={1}
                    showTimeSelect
                />
            </div>
        );
    }

    endDateSelect() {
        return (
            <div>
                <ReactDatePicker
                    wrapperClassName="wrapper"
                    className="input date-picker-input"
                    selected={new Date(this.state.endDate)}
                    onChange={date =>
                        this.onChangeDateSelect(
                            date,
                            "transaction_end_datetime",
                            "endDate"
                        )
                    }
                    dateFormat={constants.DATE_FORMAT}
                    timeFormat={constants.TIME_FORMAT}
                    timeIntervals={1}
                    showTimeSelect
                />
            </div>
        );
    }

    nodeSelect() {
        return (
            <div>
                <MultiSelectSearchableComboBox
                    onSelectOption={(options, index, evt) =>
                        this.onOptionChange(
                            options,
                            "nodeLabel",
                            "nodeSelected",
                            "node_name",
                            "nodeQuery"
                        )
                    }
                    selectedOptions={this.state.nodeSelected}
                    options={this.state.nodeList}
                    resetButtonLabel={constants.RESET_BTN_LABEL}
                    label={this.state.nodeLabel}
                />
            </div>
        );
    }

    journeySelect() {
        return (
            <div>
                <MultiSelectSearchableComboBox
                    onSelectOption={(options, index, evt) =>
                        this.onOptionChange(
                            options,
                            "journeyLabel",
                            "journeySelected",
                            "journey_name",
                            "journeyQuery"
                        )
                    }
                    selectedOptions={this.state.journeySelected}
                    options={this.state.journeyList}
                    resetButtonLabel={constants.RESET_BTN_LABEL}
                    label={this.state.journeyLabel}
                />
            </div>
        );
    }

    customerSelect() {
        return (
            <div>
                <MultiSelectSearchableComboBox
                    onSelectOption={(option, index, evt) =>
                        this.onOptionChange(
                            option,
                            "customerLabel",
                            "customerSelected",
                            "customer_name",
                            "customerQuery"
                        )
                    }
                    selectedOptions={this.state.customerSelected}
                    options={this.state.customerList}
                    resetButtonLabel={constants.RESET_BTN_LABEL}
                    label={this.state.customerLabel}
                />
            </div>
        );
    }

    /**
     * Render the Html component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <main className="section">
                <div className="report-controls">
                    <h3 id="transaction-request-reponse-heading">
                        Transaction Request/Response Report
                    </h3>
                </div>
                <div className="columns report-controls">
                        <div className="column is-one-fifth">
                            {commonConstants.START_DATE}
                            {this.renderDatePicker(
                                "transaction_start_datetime",
                                "startDate",
                                this.state.startDate
                            )}
                        </div>
                        <div className="column is-one-fifth">
                            {commonConstants.END_DATE}
                            {this.renderDatePicker(
                                "transaction_end_datetime",
                                "endDate",
                                this.state.endDate
                            )}
                        </div>
                    <div className="column is-one-fifth">
                        {commonConstants.CUSTOMER} {this.customerSelect()}
                    </div>
                    <div className="column is-one-fifth"></div>
                    <div className="column is-one-fifth export card">
                        {commonConstants.EXPORT_DATA}{" "}
                        {this.exportQueryDataSelect()}
                    </div>
                </div>
                <div className="columns report-controls">
                    <div className="column is-one-fifth">
                        {commonConstants.JOURNEY_NAME} {this.journeySelect()}
                    </div>
                    <div className="column is-one-fifth">
                        {commonConstants.POINT_SOLUTION_PACKAGE}{" "}
                        {this.nodeSelect()}
                    </div>
                    <div className="column is-one-fifth"></div>
                </div>
                <div id="row4" className="columns">
                    <div
                        id="transaction-timeline-details-report"
                        className="paddingRight0 column contentWidth"
                    >
                        <div className="card mb-5">
                            <div className="card-content">
                                <h2 className="card-header-title">
                                    Transaction Request/Response Table
                                </h2>

                                {this.renderTransactionsTimelineDetailsReport()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
