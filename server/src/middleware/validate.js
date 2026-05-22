const ApiError = require('../utils/ApiError');

function validateBody(requiredFields = []) {
  return (req, _res, next) => {
    const missing = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
    );

    if (missing.length > 0) {
      return next(ApiError.badRequest(`Missing required fields: ${missing.join(', ')}`));
    }

    next();
  };
}

function validateObjectId(paramName = 'id') {
  return (req, _res, next) => {
    const id = req.params[paramName];
    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return next(ApiError.badRequest(`Invalid ${paramName}`));
    }
    next();
  };
}

module.exports = { validateBody, validateObjectId };
