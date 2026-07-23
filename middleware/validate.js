const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: "error",
        message: err.errors.map((e) => e.message).join(", "),
      });
    }

    next(err);
  }
};

module.exports = { validate };
