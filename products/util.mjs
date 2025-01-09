export const resList = {
    "invalidIdRes": {
        statusCode: 400,
        body: JSON.stringify({ error: 'Id must be an integer' }),
    },
    "recordNotFoundRes": {
        statusCode: 404,
        body: JSON.stringify({ error: 'Record not found' }),
    },
    "internalErrorRes": {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
    }
};