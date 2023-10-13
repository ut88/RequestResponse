//Utils
import fieldTitleDataMapper from './fieldTitleDataMapper';

export default class TransactionRequestResponseCommon {
    /**
     *
     * @constructor
     */
    constructor(parameters, state, templateService, isExport = true) {
        this.state = state;
        this.parameters = parameters;
        this.filterData = templateService ? templateService.getFilterData() : null;
        this.isExport = true;
    }

    /**
     *
     * @param {QueryData} queryData
     * @param {DataMapper} dataMapper
     */
    TransactionRequestResponseDataMapper(queryName, queryData, dataMapper) {
        //const fieldTitleDataMapper = fieldTitleDataMapper;
        let fieldNames = ['transaction_timestamp','customer_name','journey_name','node_name','request','response'];
        
        // map the structured data
        fieldTitleDataMapper.map(item => {
            dataMapper.header(item.label, item.dataType);
        });

        return (row) => {
            let data = [];
            
            fieldNames.forEach(item => {
                if(item==='transaction_timestamp'){
                       const inputDateTime = row[queryData.getFieldByName(item).index] * 1000
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
                    data.push({v :formattedDate}); 
                }else{
                data.push({v : row[queryData.getFieldByName(item).index]});  
                }
            });

            return data;
        }
    }
}
