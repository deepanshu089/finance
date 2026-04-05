const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    statusCode = 400;
    message = `Duplicate field value entered for: ${Object.keys(err.meta?.target || {}).join(", ")}`;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  // Prisma validation error
  if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Invalid input data";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { errorHandler };
