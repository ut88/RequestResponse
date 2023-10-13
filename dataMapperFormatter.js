// public interface
import { getNumberFormatter } from "../../shared/text-formatters/formatterCommon";

// shared common libs
import DefaultNumFormatter from "@shared/text-formatters/defaultNumFormatter";

//constants
import constants from "../constants/constants";

const formatters = {
    [constants.transaction_timestamp]: {
        formatter: getNumberFormatter,
        options: {}
    },
    [constants.customer_name]: {
        formatter: DefaultNumFormatter,
        options: {}
    },
    [constants.journey_name]: {
        formatter: DefaultNumFormatter,
        options: {}
    },
    [constants.node_name]: {
        formatter: DefaultNumFormatter,
        options: {}
    },
    [constants.request]: {
        formatter: DefaultNumFormatter,
        options: {}
    },
    [constants.response]: {
        formatter: DefaultNumFormatter,
        options: {}
    }
};

export default formatters;
