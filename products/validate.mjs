export const validateIdField = (id) => {
    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
        return false;
    }
    return true;
};

export const validateTextFields = (fields) => {
    const errors = {};

    Object.keys(fields).forEach((key) => {
        const value = fields[key];
        if (typeof value === 'string' && value.trim() === "") {
            errors[key] = `${key} must be a non-empty string`;
        }
    });

    return errors;
};

export const validateBooleanFields = (fields) => {
    const errors = {};

    Object.keys(fields).forEach((key) => {
        const value = fields[key];
        if (value !== undefined && typeof value !== 'boolean') {
            errors[key] = `${key} must be a boolean`;
        }
    });

    return errors;
};

export const validateNumberFields = (fields) => {
    const errors = {};

    Object.keys(fields).forEach((key) => {
        const value = fields[key];
        if (value !== undefined && (isNaN(value) || typeof value !== 'number')) {
            errors[key] = `${key} must be a number`;
        }
    });

    return errors;
};