'use strict';

module.exports = (mainErrorName, errorDescription) => {
    return {
        error: mainErrorName,
        description: errorDescription
    }
};
