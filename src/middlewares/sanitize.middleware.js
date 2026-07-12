const sanitize = require("sanitize-html");

const sanitizeObject = (obj) => {
  if (typeof obj === "string") {
    return sanitize(obj, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      obj[key] = sanitizeObject(obj[key]);
    });
  }

  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

module.exports = sanitizeMiddleware;
