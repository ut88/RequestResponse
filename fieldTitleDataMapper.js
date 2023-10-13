import constants from "../constants/constants";

const fieldTitleDataMapper = [
    { 
        label: constants.transaction_timestamp, 
        dataType: constants.DATA_TYPE.STRING
    },
    { 
        label: constants.customer_name, 
        dataType: constants.DATA_TYPE.STRING
    },
    { 
        label: constants.journey_name, 
        dataType: constants.DATA_TYPE.STRING
    },
    { 
        label: constants.node_name, 
        dataType: constants.DATA_TYPE.STRING
    },
    { 
        label: constants.request, 
        dataType: constants.DATA_TYPE.STRING
    },
    { 
        label: constants.response, 
        dataType: constants.DATA_TYPE.STRING
    }
];

export default fieldTitleDataMapper;
