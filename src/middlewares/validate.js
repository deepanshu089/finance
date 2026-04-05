const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Inject validated data back into the request
    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;
    
    next();
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: messages
      });
    }
    next(error);
  }
};

module.exports = { validate };
